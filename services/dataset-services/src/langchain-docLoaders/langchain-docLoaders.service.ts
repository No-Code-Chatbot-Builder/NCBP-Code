import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PPTXLoader } from 'langchain/document_loaders/fs/pptx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { join } from 'path';
import { HttpService } from '@nestjs/axios';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { Express } from 'express'; // Import Express namespace
import { GenerateIdService } from 'src/generate-id/generate-id.service';

@Injectable()
export class LangchainDocLoaderService {
  private data: any;
  private savePath: string;

  constructor(
    private httpService: HttpService,
    private pineconeService: PineconeService
  ) {}

  async dataProcessor(data: File | string, userId: string, workspaceId: string, datasetId: string, dataId: string){
    this.data = data;

    let document: any;

    if (typeof this.data === 'object') {
      document = await this.fileProcessor(this.data);
    } else if (typeof this.data === 'string') {
      document = await this.webLoader(this.data);
    }

    let texts: string[] = [];
    for (let i = 0; i < document.length; i++) {
      texts.push(document[i].pageContent);
    }

    const maxChunkSizeInBytes = 1024 * 1023; // 1 MB in bytes
    const responses = await this.sendTextsInChunks(texts, maxChunkSizeInBytes);

    // Process responses as needed
    console.log(responses);

    const id = GenerateIdService.generateId();
    for (const response of responses) {
      this.pineconeService.upsertRecords(id, response, userId, workspaceId, datasetId, dataId);
    }
    
    // try {
    //   const response = await this.httpService
    //     .post('http://Fargat-Farga-OpBzm5amP8IR-1656924029.us-east-1.elb.amazonaws.com/vectorEmbeddings', {
    //       texts: texts // Replace with actual texts
    //     })
    //     .toPromise(); // Convert Observable to Promise

        
    //     this.pineconeService.upsertRecords(response.data, userId, workspaceId, datasetId, dataId);

    // } catch (error) {
    //   console.error('Error sending text to server:', error);
    // }
  }

  private async sendTextsInChunks(texts: string[], maxChunkSizeInBytes: number) {
    let currentChunk = [];
    let currentChunkSize = 0;
    const responses = [];

    for (const text of texts) {
      const textSize = Buffer.byteLength(text, 'utf-8'); // Calculate the size of the text in bytes

      if (currentChunkSize + textSize > maxChunkSizeInBytes) {
        // Send the current chunk if adding the new text exceeds the maximum chunk size
        try {
          const response = await this.httpService.post(
            'http://langchain-embedding-service.services/vectorEmbeddings',
            { texts: currentChunk }
          ).toPromise();
          responses.push(response.data);
        } catch (error) {
          console.error('Error sending chunk:', error);
        }

        // Start a new chunk
        currentChunk = [];
        currentChunkSize = 0;
      }

      // Add text to the current chunk
      currentChunk.push(text);
      currentChunkSize += textSize;
    }

    // Send the last chunk if there are any texts left
    if (currentChunk.length > 0) {
      try {
        const response = await this.httpService.post(
          'http://langchain-embedding-service.services/vectorEmbeddings',
          { texts: currentChunk }
        ).toPromise();
        responses.push(response.data);
      } catch (error) {
        console.error('Error sending chunk:', error);
      }
    }

    return responses;
  }
  async fileProcessor(file: Express.Multer.File) {
    // Fix parameter type declaration
    // Define the path where you want to save the file
    this.savePath = join(__dirname, '..', 'uploads');

    // Write the file to the server
    writeFileSync(this.savePath, file.buffer);
    let text: string | string[];
    switch (file.mimetype) {
      case 'application/pdf':
        // Handle PDF file
        text = await this.docLoader(new PDFLoader(this.savePath));
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // Handle DOCX file
        text = await this.docLoader(new DocxLoader(this.savePath));
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        // Handle PPT file
        text = await this.docLoader(new PPTXLoader(this.savePath));
        break;
      case 'text/plain':
        // Handle text file
        text = await this.docLoader(new TextLoader(this.savePath));
        break;
      // Add more cases as needed for other file types
    }

    return text;
  }
  async docLoader(loader: TextLoader | PDFLoader | PPTXLoader | TextLoader): Promise<any> {
    const docs = await loader.load();
    return docs;
  }
  async webLoader(url: string) {
    const loader = new CheerioWebBaseLoader(url);

    const docs = await loader.load();
    return docs;
  }
}
