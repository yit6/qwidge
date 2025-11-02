import axios from 'axios'

const host = 'http://localhost:8080'

interface Service {
    id: number,
    title: string,
    description: string,
    imageUrl: string | null,
    rating: number,
    sources: string[],
}

let services: Service[]

async function getData() {
    services = (await axios.get(host+'/services')).data;
    console.log("backend contacted", services)
}


async function getServices(): Promise<Service[]> {
    if (!services) {
        await getData();
    }
    return services;
}

async function getService(id: number): Promise<Service> {
    if (!services) {
        await getData();
    }
    for (const i of services) {
        if (i.id === id) {
            return i;
        }
    }
    throw new Error("key not found: "+ id)
}

export {getService, getServices, Service};