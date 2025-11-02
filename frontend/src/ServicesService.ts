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

async function getSearch(q: string): Promise<Service[]> {
	const res:number[] = await axios.get(`http://localhost:8080/search?q=${q}`);
	console.log(res);

	const ids = res.data.ids;

	const services:Service[] = await Promise.all(ids.map(getService));
	console.log(services);
	return services;
}

export {getService, getServices, getSearch, Service};
