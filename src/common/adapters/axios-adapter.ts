import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/htt-adapter.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private  axios: AxiosInstance = axios;
    

    async get<T>(url: string): Promise<T> {
        try {
                const {data} =await this.axios.get<T>(url);
                return data;
    
        } catch (error){
        
            throw new Error("Error, please check logs"+ error);
        }
    }
}