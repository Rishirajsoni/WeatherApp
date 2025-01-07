export type weatherData = {
    cod: number;
    coord: any;
    dt: number;
    main: main;
    name: string;
    weather: weather[];
    message: string;
}

export type main = {
    feels_like: number;
    temp: number;
}

export type coord = {
    lat: number;
    lon: number;
}

export type weather = {
    description: string;
}

export type refreshToken = {
    accessToken: string;
    refreshToken: string;
}

export type cardDetail = {
    name: string;
    temp: number | null;
}

export type userDetail = {
    name: string;
    email: string;
    image: URL;
}

export type WeatherEntry = {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
    };
    weather: {
        description: string;
    }[];
    dt_txt: string;
};

export type ForecastResponse = {
    list: WeatherEntry[];
};