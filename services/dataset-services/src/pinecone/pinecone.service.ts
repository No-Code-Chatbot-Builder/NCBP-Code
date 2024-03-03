import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';
import { CreateIndexRequestMetricEnum } from '@pinecone-database/pinecone';
import { GenerateIdService } from 'src/generate-id/generate-id.service';

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

  async upsertRecords(records: dataForUpsert, userId: string, workspaceId: string, datasetId: string) {
    // Upsert the data into your index
    const indexName = this.configService.get<string>('PINECONE_INDEX_NAME');

    for (let i = 0; i < records[0].embeddings.length; i++) {
      const embedding = records[0].embeddings[i];
      const splittedDocument = records[1].splitted_documents[i];
      await this.pineconeClient.index(indexName).upsert([
        {
          id: GenerateIdService.generateId(),
          values: embedding,
          metadata: {
            userId: userId,
            workspaceId: workspaceId,
            datasetId: datasetId,
            text: splittedDocument
          }
        }
      ]);
    }
  }
}
