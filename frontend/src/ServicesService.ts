import axios from 'axios'

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
    services = (await axios.get('http://localhost:8080/services')).data;
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
    return services[id]!;
}

export {getService, getServices, Service};