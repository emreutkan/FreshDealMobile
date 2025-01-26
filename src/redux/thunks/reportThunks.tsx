import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";
import {API_BASE_URL} from "@/src/redux/api/API";

export const createReportThunk = createAsyncThunk(
    'report/create',
    async ({
               purchase_id,
               description,
               image,
               token
           }: {
        purchase_id: number,
        description: string,
        image: {
            uri: string,
            name: string,
            type: string
        },
        token: string
    }, {rejectWithValue}) => {
        try {
            const formData = new FormData();
            formData.append('purchase_id', purchase_id.toString());
            formData.append('description', description);
            formData.append('image', {
                uri: image.uri,
                name: image.name,
                type: image.type
            } as any);

            const response = await axios.post(
                `${API_BASE_URL}/report`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'An error occurred while creating the report'
            );
        }
    }
);