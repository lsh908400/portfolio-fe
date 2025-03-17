/**
 * 2025 03 16 - 이상훈
 * 1. useState - 날씨정보 / 로딩 / 에러 / 도시정보 / 검색정보
 * 2. 날씨 설명 인코더
 * 3. useEffect - 현재 위치 날씨 정보 / 도시 위치 날씨 정보
 */


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../../../util/Loading';
import ErrorMessage from '../../../util/ErrorMessage';

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        wind_speed_10m: number;
        weather_code: number;
    };
    current_units: {
        temperature_2m: string;
        relative_humidity_2m: string;
        apparent_temperature: string;
        precipitation: string;
        wind_speed_10m: string;
    };
}

interface GeocodingResult {
    results?: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
        country: string;
        admin1?: string;
    }[];
    error?: boolean;
    reason?: string;
}

const Weather: React.FC = () => {

    // 1. useState - 날씨정보 / 로딩 / 에러 / 도시정보 / 검색정보
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('');
    const [locationName, setLocationName] = useState<string>('');

    // 2. 날씨 설명 인코더
    const getWeatherInfo = (code: number) => {
        const weatherCodes: Record<number, { description: string; icon: string }> = {
        0: { description: '맑음', icon: '☀️' },
        1: { description: '대체로 맑음', icon: '🌤️' },
        2: { description: '부분적으로 흐림', icon: '⛅' },
        3: { description: '흐림', icon: '☁️' },
        45: { description: '안개', icon: '🌫️' },
        48: { description: '서리 안개', icon: '🌫️' },
        51: { description: '가벼운 이슬비', icon: '🌦️' },
        53: { description: '이슬비', icon: '🌦️' },
        55: { description: '강한 이슬비', icon: '🌧️' },
        56: { description: '가벼운 얼어붙은 이슬비', icon: '🌨️' },
        57: { description: '강한 얼어붙은 이슬비', icon: '🌨️' },
        61: { description: '약한 비', icon: '🌧️' },
        63: { description: '비', icon: '🌧️' },
        65: { description: '강한 비', icon: '🌧️' },
        66: { description: '가벼운 얼어붙은 비', icon: '🌨️' },
        67: { description: '강한 얼어붙은 비', icon: '🌨️' },
        71: { description: '약한 눈', icon: '🌨️' },
        73: { description: '눈', icon: '🌨️' },
        75: { description: '강한 눈', icon: '❄️' },
        77: { description: '눈알', icon: '❄️' },
        80: { description: '약한 소나기', icon: '🌦️' },
        81: { description: '소나기', icon: '🌧️' },
        82: { description: '강한 소나기', icon: '⛈️' },
        85: { description: '약한 눈 소나기', icon: '🌨️' },
        86: { description: '강한 눈 소나기', icon: '❄️' },
        95: { description: '천둥번개', icon: '⛈️' },
        96: { description: '약한 우박을 동반한 천둥번개', icon: '⛈️' },
        99: { description: '강한 우박을 동반한 천둥번개', icon: '⛈️' },
        };
        
        return weatherCodes[code] || { description: '알 수 없음', icon: '❓' };
    };

    // 3. useEffect - 현재 위치 날씨 정보 / 도시 위치 날씨 정보
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
            const { latitude, longitude } = position.coords;
            
            // 역지오코딩으로 위치 이름 가져오기 - 수정된 URL
            try {
                const geocodingResponse = await axios.get(
                `https://api.open-meteo.com/v1/geocode/reverse?latitude=${latitude}&longitude=${longitude}`
                );
                
                if (geocodingResponse.data.results) {
                const locationData = geocodingResponse.data.results[0];
                setLocationName(`${locationData.name}, ${locationData.country}`);
                }
            } catch (geoErr) {
                console.error('위치 이름을 가져오는데 실패했습니다:', geoErr);
                setLocationName('현재 위치');
            }
            
            // 날씨 데이터 가져오기
            const weatherResponse = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`
            );
            
            setWeatherData(weatherResponse.data);
            setLoading(false);
            } catch (err) {
            setError('날씨 정보를 가져오는데 실패했습니다.');
            setLoading(false);
            }
        },
        () => {
            setError('위치 정보를 가져오는데 실패했습니다. 도시 이름으로 검색해보세요.');
            setLoading(false);
        }
        );
    }, []);

    const searchByCity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError(null);
        
        try {
        // 지오코딩으로 도시 좌표 가져오기
        const geocodingResponse = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );
        
        const geocodingData: GeocodingResult = geocodingResponse.data;
        
        if (!geocodingData.results || geocodingData.results.length === 0) {
            throw new Error('도시를 찾을 수 없습니다.');
        }
        
        const { latitude, longitude, name, country, admin1 } = geocodingData.results[0];
        setLocationName(`${name}, ${admin1 ? `${admin1}, ` : ''}${country}`);
        
        // 해당 좌표의 날씨 데이터 가져오기
        const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`
        );
        
        setWeatherData(weatherResponse.data);
        setLoading(false);
        } catch (err) {
        setError('도시를 찾을 수 없습니다. 정확한 도시 이름을 입력해주세요.');
        setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">날씨 앱</h1>
        
        <form onSubmit={searchByCity} className="flex mb-6">
            <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="도시 이름 입력..."
            className="flex-1 px-4 py-2 rounded-l-lg border-t border-b border-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
            검색
            </button>
        </form>

        {loading && <Loading />}
        
        {error && <ErrorMessage message={error}/>}
        
        {weatherData && !loading && (
            <div className="bg-white p-6 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{locationName || '현재 위치'}</h2>
                <div className="flex items-center">
                <span className="text-5xl">
                    {getWeatherInfo(weatherData.current.weather_code).icon}
                </span>
                </div>
            </div>
            
            <div className="text-center mb-4">
                <span className="text-5xl font-bold">
                {Math.round(weatherData.current.temperature_2m)}°C
                </span>
                <p className="text-gray-500">
                {getWeatherInfo(weatherData.current.weather_code).description}
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-500">체감 온도</p>
                <p className="text-xl font-semibold">
                    {Math.round(weatherData.current.apparent_temperature)}°C
                </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-500">습도</p>
                <p className="text-xl font-semibold">
                    {weatherData.current.relative_humidity_2m}%
                </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-500">강수량</p>
                <p className="text-xl font-semibold">
                    {weatherData.current.precipitation} mm
                </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-gray-500">풍속</p>
                <p className="text-xl font-semibold">
                    {weatherData.current.wind_speed_10m} km/h
                </p>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Weather;