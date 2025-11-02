interface Service {
    id: number,
    title: string,
    description: string,
    imageUrl: string,
    rating: number,
    sources: string[],
}

let mockServices: Service[] = [
    { id: 0, title: "Service1", description: "desc", imageUrl: "https://i.redd.it/j5ar4s9xl8k11.jpg", rating: 3, sources: [] },
    { id: 1, title: "Service2", description: "desc", imageUrl: "", rating: 5, sources: [] }
]

function getServices(): Service[] {
    return mockServices;
}

function getService(id: number): Service {
    return mockServices[id];
}

export {getService, getServices};