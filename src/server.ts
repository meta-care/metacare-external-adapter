import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";
import internal from "stream";
// import testJson from './test.json';

// interface healthData{
//     date: string
//     heartRate: number
//     id: number
// }



type EAInput ={ // needs to be changed - would recommend looking at what the API endpoint looks like to understand what fields for input may be required for pulling
    id: number | string;
    data :{
        date : string; // 11/15/2022
        heartRate: number | string; 
        id: number;
    }
}

type EAOutput ={
    jobRunID: string| number; // needs to be pulled from 
    statusCode: number;
    data:{
        result?: any;
    }
    error?: string;
}


// let obj: EAInput = JSON.parse('{"data":[{"date":"11/15/2022","heartRate":80,"id":2}]}');
// const result = JSON.parse(jsonStr) as EAInput;


const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("this is a test for the external adapter ");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

//var url = 'https://api.sheety.co/e20fe42944a3c6c3b83da571d8e858a8/metacare/data?filter[id]='; //${eaInputData.data.id} //?filter[id]=2 //?filter[id]=3 // ?filter[id]=5 //?filter[id]=5

// function getHeartRate(id:string): Promise <healthData> {
//     url = url + id;
//     return fetch(url).then(res => res.json()).then(res => {
//         return res as healthData
//     })
// }


// var heartRate = getHeartRate('2');
// console.log(heartRate)

app.post("/", async (req: Request, res: Response) => { // changed post to get
    const eaInputData: EAInput = req.body;
    console.log(" Request data received : ", eaInputData);

    const url = 'https://api.sheety.co/e20fe42944a3c6c3b83da571d8e858a8/metacare/data?filter[id]=2'; //${eaInputData.data.id} //?filter[id]=2 //?filter[id]=3 // ?filter[id]=5 //?filter[id]=5

    
    
    // build external adapters response
    let eaResponse: EAOutput = {
        data:{},
        jobRunID: eaInputData.id,
        statusCode: 0,
    };


    try {
        const apiResponse: AxiosResponse = await axios.get(url);

        eaResponse.data = { result: apiResponse.data };
        eaResponse.statusCode = apiResponse.status;
        //eaResponse.data                 // added this line

        console.log("RETURNED response: ", eaResponse);
        res.json(eaResponse);

    } catch(error: any) {
        console.log("API Response Error: ", error);

        eaResponse.error = error.message;
        eaResponse.statusCode = error.response.status;

        res.json(eaResponse);
    }
})


//     app.listen(PORT, () => {
//         console.log('Server is listening on port ${PORT}.');
// })
