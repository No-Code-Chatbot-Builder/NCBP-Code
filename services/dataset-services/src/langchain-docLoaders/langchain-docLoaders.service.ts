import { Injectable} from '@nestjs/common';
import { writeFileSync } from 'fs';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PPTXLoader } from "langchain/document_loaders/fs/pptx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { join } from 'path';
import { HttpService } from '@nestjs/axios';


/*
    Please note that the following class will be adjusted to incorporate Strategy/Factory Pattern to address various loaders
*/
@Injectable()
export class LangchainService {
    
    private data: any;
    private savePath: string;

    
    
    constructor(private httpService: HttpService) {
        



    }

    async dataProcessor(data: File | string)
    {
        this.data = data;
        if (typeof(this.data) === "object") {
            this.fileProcessor(this.data);
        }else if (typeof(this.data) === "string") {
            this.webLoader(this.data);
        }

    }
    async fileProcessor(file: Express.Multer.File)
    {
        // Define the path where you want to save the file
        this.savePath = join(__dirname, '..', 'uploads');

        // Write the file to the server
        writeFileSync(this.savePath, file.buffer);
        let text;
        switch (file.mimetype) {
            
            case 'application/pdf':
                // Handle PDF file
                text = this.pdfLoader(file);
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                // Handle DOCX file
                text = this.docxLoader(file);
                break;
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                // Handle PPT file
                text = this.pptLoader(file);
                break;
            case 'text/plain':
                // Handle text file
                text = this.textLoader(file);
                break;
            // Add more cases as needed for other file types
        }

        try {
            const response = await this.httpService.post('http://localhost:80', {
              text: text
            }).toPromise(); // Convert Observable to Promise
      
            console.log('Response from server:', response.data);
          } catch (error) {
            console.error('Error sending text to server:', error);
          }
    }

    async pdfLoader(file: Express.Multer.File) // one document per page
    {        
        const loader = new PDFLoader(this.savePath);
        const docs = await loader.load(); 
        return docs
    }
    async pptLoader(file: Express.Multer.File) 
    {
        
        const loader = new PPTXLoader(this.savePath);

        const docs = await loader.load();
        return docs
    }
    async docxLoader(file: Express.Multer.File)
    {
        const loader = new DocxLoader(this.savePath);

        const docs = await loader.load();
        return docs
    }
    async textLoader(file: Express.Multer.File) 
    {
        const loader = new TextLoader(this.savePath);

        const docs = await loader.load();
        return docs
    }
    async webLoader(url: string)
    {
        const loader = new CheerioWebBaseLoader(url);
          
          const docs = await loader.load();
          return docs
    }
}
