import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';
import { CreateIndexRequestMetricEnum } from '@pinecone-database/pinecone';
import { GenerateIdService } from 'src/generate-id/generate-id.service';
import { UUID } from 'crypto';

type Embedding = number[]; // Assuming each embedding is an array of numbers

interface EmbeddingsObject {
  embeddings: Embedding[];
}

interface SplittedDocumentsObject {
  splitted_documents: string[];
}

type dataForUpsert = [EmbeddingsObject, SplittedDocumentsObject];

@Injectable()
export class PineconeService {
  private readonly pineconeClient: Pinecone;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('PINECONE_API_KEY');
    this.pineconeClient = new Pinecone({
      apiKey: apiKey
    });
  }

  async createIndex(indexName: string, dimension: number, metric: CreateIndexRequestMetricEnum) {
    const response = await this.pineconeClient.createIndex({
      name: indexName,
      dimension: dimension,
      metric: metric,
      spec: {
        pod: {
          environment: 'gcp-starter',
          podType: 's1.x1'
        }
      }
    });
    return response;
  }

  async upsertRecords(id: GenerateIdService, records: dataForUpsert, userId: string, workspaceId: string, datasetId: string, dataId: string) {
    // Upsert the data into your index
    const indexName = this.configService.get<string>('PINECONE_INDEX_NAME');
    
    for (let i = 0; i < records[0].embeddings.length; i++) {
      const embedding = records[0].embeddings[i];
      console.log('embeddings', embedding);
      const splittedDocument = records[1].splitted_documents[i];
      await this.pineconeClient.index(indexName).upsert([
        {
          id: id+"_"+(i+1),
          values: embedding,
          metadata: {
            userId: userId,
            workspaceId: workspaceId,
            datasetId: datasetId,
            text: splittedDocument,
            chunk_id : (i+1),
          }
        }
      ]);
    }
  }

  async deleteVector(dataId: string) {
    const indexName = this.configService.get<string>('PINECONE_INDEX_NAME');

    try {
      await this.pineconeClient.index(indexName).deleteMany({
        //datasetId : {$eq: datasetId},
        //workspaceId : {$eq: workspaceId},
        dataId: { $eq: dataId }
      });

      console.log('succesfuly deleted vectors');
      return 'succesfuly deleted vectors';
    } catch (error) {
      console.log(error);
    }
  }
}
