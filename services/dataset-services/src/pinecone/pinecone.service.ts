import { Injectable } from '@nestjs/common';
import { Pinecone} from '@pinecone-database/pinecone';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PineconeService {
    private readonly pineconeClient: Pinecone;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('PINECONE_API_KEY');
        this.pineconeClient = new Pinecone({
            apiKey: apiKey,
        });
    }

    async createIndex(indexName: string, dimension: number, metric: string) {
        const response = await this.pineconeClient.createIndex({
            name: indexName,
            dimension: dimension,
            metric: 'cosine',
            spec: {
              pod: {
                environment: 'gcp-starter',
                podType: 's1.x1',
              }
            }
          });
        return response;
    }

}

