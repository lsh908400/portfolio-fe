/**
 * 2025 03 16 - 이상훈
 * 1. useState - 이벤트 / 새로운 이벤트등록 / 필터기능 / 모달
 * 2. Handler - 추가 / 삭제
 * 3. 기본 설정 - 필터링 / 색상매칭
 * 4. useEffect - 로컬 스토리지 로드 / 로컬스토리지 저장
 */

import React, { useState, useEffect } from 'react';
import { TimelineEvent } from '../../../../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../../../util/Loading';
import ErrorMessage from '../../../util/ErrorMessage';
import { deleteTimeline, getTimelines, postTimeline } from '../../../../services/timeLineService';



const Timeline: React.FC = () => {
    const queryClient = useQueryClient();

    // 1. useState - 이벤트 / 새로운 이벤트등록 / 필터기능 / 모달
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({
        title: '',
        date: '',
        desc: '',
        category: 'personal', 
    });
    const [filter, setFilter] = useState<string>('all');
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);


    // 2. useQuery - 이벤트 불러오기
    const {data,isLoading,isError,refetch,error} = useQuery({
        queryKey: ['timeline'],
        queryFn: async () => {
            const response = await getTimelines();

            if (!response.success || response.data === undefined || !response) {
                return [];
            }
            return response?.data;
        },
        enabled: true,
    })

    

    // 3. mutation - 이벤트 등록 / 삭제
    const postTimelineMutation = useMutation({
        mutationFn: (newEvent: Omit<TimelineEvent, 'id'>) => postTimeline(newEvent),
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['timeline'] });
            
            const refreshResponse = await getTimelines();
            if (refreshResponse.data) {
                setEvents(refreshResponse.data);
            }
        },
        onError: (error: any) => {
            console.error('타임라인 추가 중 에러 발생:', error);
            alert('타임라인 추가에 실패했습니다.');
        }
    });

    const deleteTimelineMutation = useMutation({
        mutationFn: (id : string) => deleteTimeline(id),
        onSuccess: async (response) => {
            alert(response.message);
            queryClient.invalidateQueries({ queryKey: ['timeline'] });

            const refreshResponse = await getTimelines();
            if (refreshResponse.data) {
                setEvents(refreshResponse.data);
            }
        },
        onError: (error : any) => {
            console.error('타임라인 삭제 중 에러 발생:', error);
            alert('타임라인 삭제에 실패했습니다.');
        }
    })


    // 4. trigger mutation - 이벤트 등록 / 삭제
    const handlePostTimeline = (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!newEvent.title || !newEvent.date) return;
        
        const colorMap: Record<string, string> = {
            personal: 'bg-blue-500',
            work: 'bg-green-500',
            historical: 'bg-orange-500',
            other: 'bg-gray-500',
        };
        
        const newEventObj: Omit<TimelineEvent, 'id'> = {
            ...newEvent,
            color: colorMap[newEvent.category] || colorMap.other,
        };
    
        postTimelineMutation.mutate(newEventObj, {
            onSuccess: () => {
                setNewEvent({
                    title: '',
                    date: '',
                    desc: '',
                    category: 'personal',
                });
                
                setIsFormVisible(false);
            }
        });
    };

    const handleDeleteTimeline = (id : string) => {
        if(!id) return;

        deleteTimelineMutation.mutate(id , {
            onSuccess: () => {
                setEvents(prev => prev.filter(event => event.id !== id));
            }
        })
    }


    // 3. 기본 설정 - 필터링 / 색상매칭
    const filteredEvents = filter === 'all' 
        ? events 
        : events.filter(event => event.category === filter);

    const getBorderColorClass = (category: string) => {
        const colorMap: Record<string, string> = {
        personal: 'border-blue-500',
        work: 'border-green-500',
        historical: 'border-orange-500',
        other: 'border-gray-500',
        };
        return colorMap[category] || colorMap.other;
    };

    // 4. useEffect - useQuery와 클라이언트 데이터의 분리
    useEffect(()=>{
        if(!data) return;
        setEvents(data)
    },[data])

    return (
    <div className="max-w-4xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">타임라인 생성기</h1>
            <div className="flex gap-4">
            <button 
                className={`px-4 py-2 rounded-md transition-colors ${
                isFormVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                onClick={() => setIsFormVisible(!isFormVisible)}
            >
                {isFormVisible ? '취소' : '이벤트 추가'}
            </button>
            
            <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">모든 이벤트</option>
                <option value="personal">개인 경험</option>
                <option value="work">업무</option>
                <option value="historical">역사적 사건</option>
                <option value="other">기타</option>
            </select>
            </div>
        </header>

        {isFormVisible && (
            <form className="bg-gray-50 p-6 rounded-lg shadow-md mb-8" onSubmit={handlePostTimeline}>
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-medium text-gray-700">제목</label>
                <input
                id="title"
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
                placeholder="이벤트 제목"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="date" className="block mb-2 font-medium text-gray-700">날짜</label>
                <input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="description" className="block mb-2 font-medium text-gray-700">설명</label>
                <textarea
                id="description"
                value={newEvent.desc}
                onChange={(e) => setNewEvent({...newEvent, desc: e.target.value})}
                placeholder="이벤트에 대한 설명"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className="mb-4">
                <label htmlFor="category" className="block mb-2 font-medium text-gray-700">카테고리</label>
                <select
                id="category"
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="personal">개인 경험</option>
                <option value="work">업무</option>
                <option value="historical">역사적 사건</option>
                <option value="other">기타</option>
                </select>
            </div>
            
            <button 
                type="submit" 
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
                추가하기
            </button>
            </form>
        )}

        <div className="relative">
            {isLoading ? (<Loading />) 
            : isError ? (<ErrorMessage message={error ? error+'' : ''} onRetry={refetch}/>) 
            : filteredEvents && filteredEvents.length > 0 ?
            (
            <div className="relative">
                <div className="absolute left-1/2 w-1 bg-gray-300 h-full transform -translate-x-1/2 z-0"></div>
                {filteredEvents.map((event, index) => (
                <div 
                    key={event.id} 
                    className={`mb-8 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} relative`}
                >
                    <div className="absolute left-1/2 w-4 h-4 bg-white border-4 rounded-full transform -translate-x-1/2 z-10 border-blue-500" />
                    
                    <div 
                    className={`w-5/12 bg-white p-4 rounded-lg shadow-md border-l-4 ${getBorderColorClass(event.category)}`}
                    >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-800">{event.title}</h3>
                        <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-gray-600 mb-3">{event.desc}</p>
                    <div className="flex justify-between items-center">
                        <span 
                        className={`px-2 py-1 text-xs rounded-full text-white capitalize ${
                            event.category === 'personal' ? 'bg-blue-500' : 
                            event.category === 'work' ? 'bg-green-500' : 
                            event.category === 'historical' ? 'bg-orange-500' : 
                            'bg-gray-500'
                        }`}
                        >
                        {event.category}
                        </span>
                        <button 
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        onClick={() => handleDeleteTimeline(event.id)}
                        >
                        삭제
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            ) 
            :(
            <p className="text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm flex justify-center">
                타임라인에 이벤트가 없습니다. 새 이벤트를 추가해보세요!
            </p>
            )}
        </div>
    </div>
    );
};

export default Timeline;