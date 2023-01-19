import process from "process";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import axios, { AxiosResponse } from "axios";

type EAInput = {
    id: number | string;
    data: {
        id: number;
    }
}

type EAOutput = {
    jobRunId: string | number; // needs to be pulled from 
    statusCode: number;
    data: {
        result?: any;
    }
    error?: string;
}

const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("this is a test for the external adapter ");
});

app.post("/", async (req: Request, res: Response) => { // changed post to get
    const eaInputData: EAInput = req.body;
    console.log(" Request data received : ", eaInputData);

    const url = `https://api.sheety.co/e20fe42944a3c6c3b83da571d8e858a8/metacare/data?filter[id]=${eaInputData.data.id}`

    // build external adapters response
    let eaResponse: EAOutput = {
        data: {},
        jobRunId: eaInputData.id,
        statusCode: 0,
    };

    try {
        const apiResponse: AxiosResponse = await axios.get(url);

        eaResponse.data = { result: apiResponse.data.data[0] };
        eaResponse.statusCode = apiResponse.status;

        console.log("response data: ", eaResponse);
        res.json(eaResponse);

    } catch (error: any) {
        console.log("error: ", error);

        eaResponse.error = error.message;
        eaResponse.statusCode = error.response.status;

        res.json(eaResponse);
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
