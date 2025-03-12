import axios from "axios";
import { FetchDogsParams, FetchDogsResponse, Match, Dog } from './types/Dogs'
import { Location, SearchLocationsParams, SearchLocationResponse } from "./types/Location";
import qs from 'qs'


const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Accept": "application/json"
    },
    withCredentials: true,
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'indices' })
    }
})

export const login = async (name: string, email: string): Promise<void> => {
    try {
        const response = await api.post('/auth/login', { name, email });
        if (response?.status === 200) {
            console.log("Login successful")
            return
        }
    } catch (error) {
        console.error('Error placing login requests:', error)
        throw error
    }
}


export const logout = async (): Promise<void> => {
    try {
        const response = await api.post('/auth/logout', {});
        if (response?.status === 200) {
            console.log("Logout successful")
            return
        }
    } catch (error) {
        console.error('Error placing login requests:', error)
        throw error
    }
}

export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {

    try {
        const response = await api.post('/locations', zipCodes)
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Error fetching Locations: ${response?.status}`)
    } catch (error) {
        console.error('Error fetching Locations:', error)
        throw error
    }
}

export const searchLocations = async (params: SearchLocationsParams): Promise<SearchLocationResponse> => {

    try {
        const response = await api.post('/locations/search', params)
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Error Searching Locations: ${response?.status}`)
    } catch (error) {
        console.error('Error Searching Locations:', error)
        throw error
    }
}

export const fetchBreeds = async (): Promise<string[]> => {
    try {
        const response = await api.get('/dogs/breeds')
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Error fetching dog breeds: ${response?.status}`)
    } catch (error) {
        console.error('Error fetching dog breeds:', error)
        throw error
    }
}

export const fetchDogDetails = async (dogIds: string[]): Promise<Dog[]> => {
    try {
        const response = await api.post('/dogs', dogIds)
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Error fetching dog details: ${response?.status}`)
    } catch (error) {
        console.error('Error fetching dog details:', error)
        throw error
    }
}

const fixUrl = (url: string): string => {
    try {
        const parsedUrl = new URL(url, process.env.REACT_APP_API_BASE_URL)
        const decodedSearchParams = new URLSearchParams(parsedUrl.search)
        return `${process.env.REACT_APP_API_BASE_URL}/dogs/search?${decodedSearchParams.toString()}`
    } catch (error) {
        console.error("Invalid URL:", url);
        return url;
    }
}

export const fetchDogsWithAppendUrl = async (url: string): Promise<FetchDogsResponse> => {

    try {
        const fixedUrl: string = fixUrl(url)
        const response = await api.get(fixedUrl)
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Unexpected error with status code: ${response?.status}`)

    } catch (error) {
        console.error('Error fetching dogs:', error)
        throw error
    }
}


export const fetchDogs = async (params: FetchDogsParams): Promise<FetchDogsResponse> => {
    try {
        const response = await api.get('/dogs/search', {
            params: {
                breed: params.breed,
                zipCodes: params.zipCodes,
                ageMin: params.ageMax,
                ageMax: params.ageMax,
                size: params?.size || 25,
                from: params?.from || 0,
                sort: params.sort,
            }
        })
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Unexpected error with status code: ${response?.status}`)

    } catch (error) {
        console.error('Error fetching dogs:', error)
        throw error
    }
}

export const generateMatch = async (params: string[]): Promise<Match> => {
    try {
        const response = await api.post<Match>('/dogs/match', params);
        if (response?.status === 200) {
            return response?.data
        }
        throw new Error(`Unexpected error with status code: ${response?.status}`)
    } catch (error) {
        console.error('Error generating match', error)
        throw error
    }
}