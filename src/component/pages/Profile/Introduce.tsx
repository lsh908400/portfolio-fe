import React, { useEffect, useState } from 'react'
import VariableInfo from '../../util/VariableInfo'
import useClickHandler from '../../../hooks/useClickHandler';
import { getIntroduction, getUser, putAdventage, putGoals, putGrowth, putMotivation } from '../../../services/profileService';
import { introduction, userData } from '../../../types';
import CommonBtn from '../../util/CommonBtn';
import useChangeHandler from '../../../hooks/useChangeHandler';


const Introduce : React.FC = () => {
    const [user, setUser] = useState<userData>();
    const [introduction, setIntroduction] = useState<introduction>();
    const [isEditing , setIsEditing] = useState([
        {id : "motivation" , isEditing : false},
        {id : "growth" , isEditing : false},
        {id : "adventage" , isEditing : false},
        {id : "goals" , isEditing : false}
    ])
    
    const handleClick = useClickHandler((e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        const bIsClickedPutMoti = target.classList.contains('put_moti')
        const bIsCLickedPutGrowth = target.classList.contains('put_growth')
        const bIsCLickedPutAdv = target.classList.contains('put_adv')
        const bIsCLickedPutGoals = target.classList.contains('put_goals')
        switch(true)
        {
            case bIsClickedPutMoti :
            {
                if(isEditing[0].isEditing)
                {
                    setIsEditing(isEditing.map(item => 
                        item.id === 'motivation' ? {...item, isEditing : false} : item
                    ));
                    target.textContent = '수정'
                    const fetchData = async () => {
                    try {
                        if(introduction?.motivation == null || undefined) return;
                        const motivationText = introduction?.motivation;
                        const [motivationResponse] = await Promise.all([
                        putMotivation(motivationText).catch(err => {
                            setError(prev => ({ ...prev, introduction: err.message || '자기소개서를 업데이트하는데 실패했습니다' }));
                            return { data: null };
                        })
                        ]);
                        
                        alert(motivationResponse.data)
                    } catch (err) {
                        console.error('데이터 로딩 중 에러 발생:', err);
                    }
                    };
                
                    fetchData();
                    return;
                }
                setIsEditing(isEditing.map(item => 
                    item.id === 'motivation' ? {...item, isEditing : true} : item
                ));
                
                target.textContent = '수정완료'
                break;
            }
            case bIsCLickedPutGrowth :
            {
                if(isEditing[1].isEditing)
                {
                    setIsEditing(isEditing.map(item => 
                        item.id === 'growth' ? {...item, isEditing : false} : item
                    ));
                    target.textContent = '수정'
                    const fetchData = async () => {
                    try {
                        if(introduction?.growth == null || undefined) return;
                        const growthText = introduction?.growth;
                        const [growthResponse] = await Promise.all([
                        putGrowth(growthText).catch(err => {
                            setError(prev => ({ ...prev, introduction: err.message || '자기소개서를 업데이트하는데 실패했습니다' }));
                            return { data: null };
                        })
                        ]);
                        
                        alert(growthResponse.data)
                    } catch (err) {
                        console.error('데이터 로딩 중 에러 발생:', err);
                    }
                    };
                
                    fetchData();
                    return;
                }
                setIsEditing(isEditing.map(item => 
                    item.id === 'growth' ? {...item, isEditing : true} : item
                ));
                
                target.textContent = '수정완료'
                break;
            }
            case bIsCLickedPutAdv :
            {
                if(isEditing[2].isEditing)
                {
                    setIsEditing(isEditing.map(item => 
                        item.id === 'adventage' ? {...item, isEditing : false} : item
                    ));
                    target.textContent = '수정'
                    const fetchData = async () => {
                    try {
                        if(introduction?.adventage == null || undefined) return;
                        const adventageText = introduction?.adventage;
                        const [adventageResponse] = await Promise.all([
                        putAdventage(adventageText).catch(err => {
                            setError(prev => ({ ...prev, introduction: err.message || '자기소개서를 업데이트하는데 실패했습니다' }));
                            return { data: null };
                        })
                        ]);
                        
                        alert(adventageResponse.data)
                    } catch (err) {
                        console.error('데이터 로딩 중 에러 발생:', err);
                    }
                    };
                
                    fetchData();
                    return;
                }
                setIsEditing(isEditing.map(item => 
                    item.id === 'adventage' ? {...item, isEditing : true} : item
                ));
                
                target.textContent = '수정완료'
                break;
            }
            case bIsCLickedPutGoals :
            {
                if(isEditing[3].isEditing)
                {
                    setIsEditing(isEditing.map(item => 
                        item.id === 'goals' ? {...item, isEditing : false} : item
                    ));
                    target.textContent = '수정'
                    const fetchData = async () => {
                    try {
                        if(introduction?.goals == null || undefined) return;
                        const goalsText = introduction?.goals;
                        const [goalsResponse] = await Promise.all([
                        putGoals(goalsText).catch(err => {
                            setError(prev => ({ ...prev, introduction: err.message || '자기소개서를 업데이트하는데 실패했습니다' }));
                            return { data: null };
                        })
                        ]);
                        
                        alert(goalsResponse.data)
                    } catch (err) {
                        console.error('데이터 로딩 중 에러 발생:', err);
                    }
                    };
                
                    fetchData();
                    return;
                }
                setIsEditing(isEditing.map(item => 
                    item.id === 'goals' ? {...item, isEditing : true} : item
                ));
                
                target.textContent = '수정완료'
                break;
            }
            default :
            {
                const bIsClickedFront = target.closest('.front_end');
                const bIsClickedBack = target.closest('.back_end');
                const bIsClickedDesign = target.closest('.design');
                const bIsClickedEmail = target.closest('.user_email');
                const bIsClickedDatabase = target.closest('.db');
                
                if(bIsClickedFront)
                {
                    console.log(bIsClickedFront)
                }
                else if(bIsClickedBack)
                {
                    console.log(bIsClickedBack)
                }
                else if(bIsClickedDesign)
                {
                    console.log(bIsClickedDesign)
                }
                else if(bIsClickedDatabase)
                {
                    console.log(bIsClickedDatabase)
                }
                else if(bIsClickedEmail)
                {
                    const emailValue = bIsClickedEmail.querySelector('.email_value')?.textContent;
                    if (emailValue) 
                    {
                    navigator.clipboard.writeText(emailValue)
                        .then(() => {
                        alert('이메일이 클립보드에 복사되었습니다.');
                        })
                        .catch(err => {
                        console.error('클립보드 복사 실패:', err);
                        });
                    }
                }
                break;
            }
        }
    })
    const handleChange = useChangeHandler((e: React.ChangeEvent, value : string) => {
        const target = e.target as HTMLElement;
        const bIsChangedMotivation = target.classList.contains('motivation')
        const bIsChangedGrowth = target.classList.contains('growth')
        const bIsChangedAdventage = target.classList.contains('adventage')
        const bIsChangedGoals = target.classList.contains('goals')


        switch(true)
        {
            case bIsChangedMotivation :
            {
                setIntroduction({
                    ...introduction,
                    motivation : value
                })
                break;
            }
            case bIsChangedGrowth :
            {
                setIntroduction({
                    ...introduction,
                    growth : value
                })
                break;
            }
            case bIsChangedAdventage :
            {
                setIntroduction({
                    ...introduction,
                    adventage : value
                })
                break;
            }
            case bIsChangedGoals :
            {
                setIntroduction({
                    ...introduction,
                    goals : value
                })
                break;
            }
        }
    })

    const [loading, setLoading] = useState({
        user: true,
        introduction: true
    });
    const [error, setError] = useState({
        user: null as string | null,
        introduction: null as string | null
    });
    
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const [userResponse, introResponse] = await Promise.all([
                getUser().catch(err => {
                    setError(prev => ({ ...prev, user: err.message || '사용자 정보를 가져오는데 실패했습니다' }));
                    return { data: null };
                }),
                getIntroduction().catch(err => {
                    setError(prev => ({ ...prev, introduction: err.message || '자기소개서를 가져오는데 실패했습니다' }));
                    return { data: null };
                })
                ]);
        
                setUser(userResponse.data);
                setLoading(prev => ({ ...prev, user: false }));
        
                setIntroduction(introResponse.data);
                setLoading(prev => ({ ...prev, introduction: false }));
            } catch (err) {
                console.error('데이터 로딩 중 에러 발생:', err);
            }
        };
    
        fetchData();
    
        return () => {
            controller.abort();
        };
    }, []);

    const isLoading = loading.user || loading.introduction;

    const hasError = error.user || error.introduction;

    if (isLoading) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }

    if (hasError) {
        return (
            <div className="error-container">
                <h3>데이터를 불러오는데 문제가 발생했습니다</h3>
                {error.user && <p>사용자 정보: {error.user}</p>}
                {error.introduction && <p>자기소개서: {error.introduction}</p>}
                <button onClick={() => window.location.reload()}>다시 시도</button>
            </div>
        );
    }

    return (
    <div id='introduce' className='flex h-full'>
        <section className='profile_section bg-introduce-aside-color w-[350px] h-full text-aside-primary'>
            <article className='side_inner_shell h-full flex items-center flex-col'>
                <div className='profile_img_box w-[200px] !mt-[60px]'>
                    <img src='/public/assets/profile.png' />
                </div>
                <div className='info_box w-full !mb-[60px]'>
                <VariableInfo
                    layout="vertical"
                    className = 'font-bold text-[1em] !mt-[50px] !px-[40px]'
                    fields={[
                        {
                        type: 'div',
                        label: `이름 :`,
                        value: user?.name,
                        className : 'user_name flex tracking-[15px] !mb-[10px]',
                        infoDivClassName : '!ml-[20px] tracking-[30px]'
                        },
                        {
                        type: 'div',
                        label: '생일 :',
                        value: user?.birth,
                        className : 'user_birth flex tracking-[15px] !mb-[10px]',
                        infoDivClassName : '!ml-[20px] tracking-[2px]'
                        },
                        {
                        type: 'div',
                        label: '주소 : ',
                        value: user?.addr,
                        className : 'user_addr flex tracking-[15px] !mb-[10px]',
                        infoDivClassName : '!ml-[20px] tracking-[1px]',
                        },
                        {
                        type: 'div',
                        label: '연락처 : ',
                        value : user?.contacts,
                        className : 'user_birth flex tracking-[7px] !mb-[10px]',
                        infoDivClassName : '!ml-[30px] tracking-[1px]',
                        },
                        {
                        type: 'div',
                        label: '이메일 : ',
                        value : user?.email,
                        onClick : handleClick,
                        className : 'user_email flex tracking-[7px] cursor-pointer !mb-[10px]',
                        infoDivClassName : 'email_value !ml-[30px] text-[0.7em] tracking-[0px]',
                        },
                        {
                        type: 'div',
                        label: '대학교 : ',
                        value : user?.university,
                        onClick : handleClick,
                        className : 'user_email flex tracking-[7px] cursor-pointer',
                        infoDivClassName : 'email_value !ml-[30px] tracking-[10px] flex items-center',
                        },
                    ]}
                    />
                </div>
                <div className='skill_box w-[80%] border-t-2'>
                    <p className='font-bold !mb-[30px]'>기술/SKILL 상세보기클릭</p>
                    <VariableInfo 
                        layout="vertical"
                        className = 'font-bold text-[1em] w-full'
                        fields={[
                            {
                            type : 'range',
                            label : 'Front End',
                            steps : 10,
                            filledSteps : 7,
                            onClick : handleClick,
                            blockWidth: '25px',
                            blockHeight: '18px',
                            className: 'front_end skill-range !mb-4 cursor-pointer'
                            },
                            {
                            type : 'range',
                            label : 'Back End',
                            steps : 10,
                            filledSteps : 8,
                            onClick : handleClick,
                            blockWidth: '25px',
                            blockHeight: '18px',
                            className: 'back_end skill-range !mb-4 cursor-pointer'
                            },
                            {
                            type : 'range',
                            label : 'UI/UX 디자인',
                            steps : 10,
                            filledSteps : 6,
                            onClick : handleClick,
                            blockWidth: '25px',
                            blockHeight: '18px',
                            className: 'design skill-range !mb-4 cursor-pointer'
                            },
                            {
                            type : 'range',
                            label : 'Database',
                            steps : 10,
                            filledSteps : 8,
                            onClick : handleClick,
                            blockWidth: '25px',
                            blockHeight: '18px',
                            className: 'db skill-range !mb-4 cursor-pointer'
                            },

                        ]}
                    />
                </div>
            </article>
        </section>
        <section className='content_section flex-grow overflow-scroll scrollbar-none'>
            <article className='content_inner_shell flex flex-col !px-[15%]'>
                <div className='conner_ribon'></div>
                <div className='title_box !mt-[100px] border-b flex items-end'>
                    <span className='font-extrabold text-[4em] !mr-[140px]'>이상훈</span>
                    <span>Sang-Hun Lee</span>
                </div>
                <div className='desc_box !mt-[5px]'>
                    <span className='text-gray-400 font-bold'>누구보다 잘하는 1년차가 되고싶은 개발자</span>
                </div>
                <div className='motivation_title_box !mt-[100px] border-b flex justify-between'>
                    <span className='font-extrabold text-[2em] !mr-[140px]'>지원동기</span>
                    <div className='flex gap-2 items-end'>
                        <CommonBtn 
                            buttonName='수 정'
                            onClick={handleClick}
                            className='!mb-2 put_moti !mr-2'
                        />
                    </div>
                </div>
                <div className='motivation_content_box !mt-[5px] text-primary'>
                    {isEditing[0].isEditing ? (
                        <div>
                            <textarea 
                            rows={10}
                            className='motivation block p-2.5 w-full text-gray-900 bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                            onChange={(e) => handleChange ? handleChange(e) : undefined} 
                            value={introduction?.motivation}></textarea>
                        </div>
                    ) : (
                        <div className='text-gray-900 bg-gray-50'>
                            {introduction?.motivation}
                        </div>
                    )} 
                </div>
                <div className='growth_title_box !mt-[100px] border-b flex justify-between'>
                    <span className='font-extrabold text-[2em] !mr-[140px]'>성장과정</span>
                    <div className='flex gap-2 items-end'>
                        <CommonBtn 
                            buttonName='수 정'
                            onClick={handleClick}
                            className='!mb-2 put_growth !mr-2'
                        />
                    </div>
                </div>
                <div className='growth_content_box !mt-[5px] text-primary'>
                    {isEditing[1].isEditing ? (
                        <div>
                            <textarea 
                            rows={10}
                            className='growth block p-2.5 w-full text-gray-900 bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                            onChange={(e) => handleChange ? handleChange(e) : undefined} 
                            value={introduction?.growth}></textarea>
                        </div>
                    ) : (
                        <div className='text-gray-900 bg-gray-50'>
                            {introduction?.growth}
                        </div>
                    )} 
                </div>
                <div className='adventage_title_box !mt-[100px] border-b flex justify-between'>
                    <span className='font-extrabold text-[2em] !mr-[140px]'>장단점</span>
                    <div className='flex gap-2 items-end'>
                        <CommonBtn 
                            buttonName='수 정'
                            onClick={handleClick}
                            className='!mb-2 put_adv !mr-2'
                        />
                    </div>
                </div>
                <div className='adventage_content_box !mt-[5px] text-primary'>
                    {isEditing[2].isEditing ? (
                        <div>
                            <textarea 
                            rows={10}
                            className='adventage block p-2.5 w-full text-gray-900 bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                            onChange={(e) => handleChange ? handleChange(e) : undefined} 
                            value={introduction?.adventage}></textarea>
                        </div>
                    ) : (
                        <div className='text-gray-900 bg-gray-50'>
                            {introduction?.adventage}
                        </div>
                    )} 
                </div>
                <div className='aspiration_title_box !mt-[100px] border-b flex justify-between'>
                    <span className='font-extrabold text-[2em] !mr-[140px]'>포부</span>
                    <div className='flex gap-2 items-end'>
                        <CommonBtn 
                            buttonName='수 정'
                            onClick={handleClick}
                            className='!mb-2 put_goals !mr-2'
                        />
                    </div>
                </div>
                <div className='aspiration_content_box !mb-[200px]'>
                    {isEditing[3].isEditing ? (
                        <div>
                            <textarea 
                            rows={10}
                            className='goals block p-2.5 w-full text-gray-900 bg-gray-50  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' 
                            onChange={(e) => handleChange ? handleChange(e) : undefined} 
                            value={introduction?.goals}></textarea>
                        </div>
                    ) : (
                        <div className='text-gray-900 bg-gray-50'>
                            {introduction?.goals}
                        </div>
                    )} 
                </div>
            </article>
        </section>
    </div>
    )
}

export default Introduce