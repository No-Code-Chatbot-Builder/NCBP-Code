import { Injectable } from '@nestjs/common';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

@Injectable()
export class LangchainService {
    constructor(){

    }
    async pdfLoader()
    {
        const loader = new PDFLoader("path/to/bitcoin.pdf");
        const docs = await loader.load();  

    }
    
}
