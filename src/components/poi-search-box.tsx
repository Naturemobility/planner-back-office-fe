import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const POI_CATEGORIES = {
  관광스팟: 2,
  액티비티: 3,
  숙소: 4,
  쇼핑: 5,
  식당: 6,
  카페: 7,
  '바/주점': 10,
};

const POI_GRADES = {
  '1등급': 1,
  '2등급': 2,
  '3등급': 3,
  사용자추가: 4,
  '재확인 필요': 5,
  '할당 필요': 6,
  임시휴업: 7,
  영구폐업: 8,
  '삭제 필요': 9,
  중복: 10,
};

type FORM_TYPE = {
  name: {
    condition: 'like' | '=' | 'in';
    inputs: string[];
  };
  googlePlaceId: {
    condition: 'like' | '=' | 'in';
    inputs: string[];
  };
  cityName: {
    condition: 'like' | '=' | 'in';
    inputs: string[];
  };
  zoneName: {
    condition: 'like' | '=' | 'in';
    inputs: string[];
  };
  poiTypeIds: number[];
  poiGrades: number[];
};

const INIT_FORM: FORM_TYPE = {
  name: {
    condition: 'like',
    inputs: [''],
  },
  googlePlaceId: {
    condition: 'like',
    inputs: [''],
  },
  cityName: {
    condition: 'like',
    inputs: [''],
  },
  zoneName: {
    condition: 'like',
    inputs: [''],
  },
  poiTypeIds: [],
  poiGrades: [],
};

export default function PoiSearchBox() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState<FORM_TYPE>(INIT_FORM);

  const onChangeInputValue = useCallback(
    (
      targetKey: 'name' | 'googlePlaceId' | 'cityName' | 'zoneName',
      inputIndex: number,
      newValue: string
    ) => {
      setForm((prev) => {
        const target = prev[targetKey];
        const newTargetInputs = [...target.inputs];
        if (newTargetInputs[inputIndex] !== undefined) {
          newTargetInputs[inputIndex] = newValue;
        }

        return {
          ...prev,
          [targetKey]: {
            condition: target.condition,
            inputs: newTargetInputs,
          },
        };
      });
    },
    []
  );

  const onClickRemoveInput = useCallback(
    (
      targetKey: 'name' | 'googlePlaceId' | 'cityName' | 'zoneName',
      inputIndex: number
    ) => {
      setForm((prev) => {
        const target = prev[targetKey];
        const newTargetInputs = [
          ...target.inputs.slice(0, inputIndex),
          ...target.inputs.slice(inputIndex + 1),
        ];

        return {
          ...prev,
          [targetKey]: {
            condition: target.condition,
            inputs: newTargetInputs,
          },
        };
      });
    },
    []
  );

  const onClickAddInput = useCallback(
    (targetKey: 'name' | 'googlePlaceId' | 'cityName' | 'zoneName') => {
      setForm((prev) => {
        const target = prev[targetKey];

        return {
          ...prev,
          [targetKey]: {
            condition: target.condition,
            inputs: [...target.inputs, ''],
          },
        };
      });
    },
    []
  );

  useEffect(() => {
    console.log('mounted!');
    try {
      const searchQuery = searchParams.get('search-query');
      if (searchQuery) {
        setForm(JSON.parse(searchQuery));
      } else {
        setForm(INIT_FORM);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(INIT_FORM) === JSON.stringify(form)) {
      navigate(pathname, { replace: true });
    } else {
      navigate(pathname + `?search-query=${JSON.stringify(form)}`, {
        replace: true,
      });
    }
  }, [form]);

  return (
    <div className='bg-gray-200 rounded-[6px] p-[20px] flex flex-col gap-[20px]'>
      <div className='flex flex-row gap-[20px] flex-wrap'>
        <span className='w-[100px]'>장소</span>
        <select
          className='p-[5px] w-[100px] rounded-[6px] h-[30px]'
          onChange={(e) => {
            if (['like', '=', 'in'].includes(e.target.value)) {
              setForm((prev) => ({
                ...prev,
                name: {
                  condition: e.target.value as 'like' | '=' | 'in',
                  inputs: [''],
                },
              }));
            }
          }}
          value={form.name.condition}
        >
          <option value='like'>포함</option>
          <option value='='>같음</option>
          <option value='in'>중에 있음</option>
        </select>
        <div className='flex flex-row gap-[5px] flex-wrap w-[calc(100%-240px)]'>
          {form.name.inputs.map((inputValue, inputIndex) => (
            <div key={`form.name.inputs_${inputIndex}`} className='relative'>
              <input
                type='text'
                className={`rounded-[6px] w-[180px] h-[30px] pl-[5px] ${
                  form.name.condition === 'in' ? 'pr-[45px]' : 'pr-[5px]'
                }`}
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onChangeInputValue('name', inputIndex, newValue);
                }}
              />
              {form.name.condition === 'in' && form.name.inputs.length > 1 && (
                <button
                  className='absolute top-[5px] right-[10px] w-[20px] h-[20px] flex items-center justify-center bg-slate-300 rounded-full text-[10px]'
                  onClick={() => {
                    onClickRemoveInput('name', inputIndex);
                  }}
                >
                  X
                </button>
              )}
            </div>
          ))}
          {form.name.condition === 'in' && (
            <button
              className='w-[30px] h-[30px] bg-white flex items-center justify-center rounded-full font-bold ml-[5px]'
              onClick={() => {
                onClickAddInput('name');
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-row gap-[20px] flex-wrap'>
        <span className='w-[100px]'>Place ID</span>
        <select
          className='p-[5px] w-[100px] rounded-[6px] h-[30px]'
          onChange={(e) => {
            if (['like', '=', 'in'].includes(e.target.value)) {
              setForm((prev) => ({
                ...prev,
                googlePlaceId: {
                  condition: e.target.value as 'like' | '=' | 'in',
                  inputs: [''],
                },
              }));
            }
          }}
          value={form.googlePlaceId.condition}
        >
          <option value='like'>포함</option>
          <option value='='>같음</option>
          <option value='in'>중에 있음</option>
        </select>
        <div className='flex flex-row gap-[5px] flex-wrap w-[calc(100%-240px)]'>
          {form.googlePlaceId.inputs.map((inputValue, inputIndex) => (
            <div
              key={`form.googlePlaceId.inputs_${inputIndex}`}
              className='relative'
            >
              <input
                type='text'
                className={`rounded-[6px] w-[180px] h-[30px] pl-[5px] ${
                  form.googlePlaceId.condition === 'in'
                    ? 'pr-[45px]'
                    : 'pr-[5px]'
                }`}
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onChangeInputValue('googlePlaceId', inputIndex, newValue);
                }}
              />
              {form.googlePlaceId.condition === 'in' &&
                form.googlePlaceId.inputs.length > 1 && (
                  <button
                    className='absolute top-[5px] right-[10px] w-[20px] h-[20px] flex items-center justify-center bg-slate-300 rounded-full text-[10px]'
                    onClick={() => {
                      onClickRemoveInput('googlePlaceId', inputIndex);
                    }}
                  >
                    X
                  </button>
                )}
            </div>
          ))}
          {form.googlePlaceId.condition === 'in' && (
            <button
              className='w-[30px] h-[30px] bg-white flex items-center justify-center rounded-full font-bold ml-[5px]'
              onClick={() => {
                onClickAddInput('googlePlaceId');
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-row gap-[20px] flex-wrap'>
        <span className='w-[100px]'>도시</span>
        <select
          className='p-[5px] w-[100px] rounded-[6px] h-[30px]'
          onChange={(e) => {
            if (['like', '=', 'in'].includes(e.target.value)) {
              setForm((prev) => ({
                ...prev,
                cityName: {
                  condition: e.target.value as 'like' | '=' | 'in',
                  inputs: [''],
                },
              }));
            }
          }}
          value={form.cityName.condition}
        >
          <option value='like'>포함</option>
          <option value='='>같음</option>
          <option value='in'>중에 있음</option>
        </select>
        <div className='flex flex-row gap-[5px] flex-wrap w-[calc(100%-240px)]'>
          {form.cityName.inputs.map((inputValue, inputIndex) => (
            <div
              key={`form.cityName.inputs_${inputIndex}`}
              className='relative'
            >
              <input
                type='text'
                className={`rounded-[6px] w-[180px] h-[30px] pl-[5px] ${
                  form.cityName.condition === 'in' ? 'pr-[45px]' : 'pr-[5px]'
                }`}
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onChangeInputValue('cityName', inputIndex, newValue);
                }}
              />
              {form.cityName.condition === 'in' &&
                form.cityName.inputs.length > 1 && (
                  <button
                    className='absolute top-[5px] right-[10px] w-[20px] h-[20px] flex items-center justify-center bg-slate-300 rounded-full text-[10px]'
                    onClick={() => {
                      onClickRemoveInput('cityName', inputIndex);
                    }}
                  >
                    X
                  </button>
                )}
            </div>
          ))}
          {form.cityName.condition === 'in' && (
            <button
              className='w-[30px] h-[30px] bg-white flex items-center justify-center rounded-full font-bold ml-[5px]'
              onClick={() => {
                onClickAddInput('cityName');
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-row gap-[20px] flex-wrap'>
        <span className='w-[100px]'>Zone</span>
        <select
          className='p-[5px] w-[100px] rounded-[6px] h-[30px]'
          onChange={(e) => {
            if (['like', '=', 'in'].includes(e.target.value)) {
              setForm((prev) => ({
                ...prev,
                zoneName: {
                  condition: e.target.value as 'like' | '=' | 'in',
                  inputs: [''],
                },
              }));
            }
          }}
          value={form.zoneName.condition}
        >
          <option value='like'>포함</option>
          <option value='='>같음</option>
          <option value='in'>중에 있음</option>
        </select>
        <div className='flex flex-row gap-[5px] flex-wrap w-[calc(100%-240px)]'>
          {form.zoneName.inputs.map((inputValue, inputIndex) => (
            <div
              key={`form.zoneName.inputs_${inputIndex}`}
              className='relative'
            >
              <input
                type='text'
                className={`rounded-[6px] w-[180px] h-[30px] pl-[5px] ${
                  form.zoneName.condition === 'in' ? 'pr-[45px]' : 'pr-[5px]'
                }`}
                value={inputValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onChangeInputValue('zoneName', inputIndex, newValue);
                }}
              />
              {form.zoneName.condition === 'in' &&
                form.zoneName.inputs.length > 1 && (
                  <button
                    className='absolute top-[5px] right-[10px] w-[20px] h-[20px] flex items-center justify-center bg-slate-300 rounded-full text-[10px]'
                    onClick={() => {
                      onClickRemoveInput('zoneName', inputIndex);
                    }}
                  >
                    X
                  </button>
                )}
            </div>
          ))}
          {form.zoneName.condition === 'in' && (
            <button
              className='w-[30px] h-[30px] bg-white flex items-center justify-center rounded-full font-bold ml-[5px]'
              onClick={() => {
                onClickAddInput('zoneName');
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-row gap-[20px] flex-wrap'>
        <span className='w-[100px]'>카테고리</span>
        <div className='flex flex-row gap-[20px] flex-wrap w-[calc(100%-120px)]'>
          {Object.entries(POI_CATEGORIES).map(([label, value]) => (
            <label key={`poi-category_${label}`} className='flex gap-[5px]'>
              <input
                type='checkbox'
                className='scale-125'
                checked={form.poiTypeIds.includes(value)}
                onChange={() => {
                  setForm((prev) => {
                    const poiTypeIds = prev.poiTypeIds;
                    if (poiTypeIds.includes(value)) {
                      return {
                        ...prev,
                        poiTypeIds: poiTypeIds.filter((id) => id !== value),
                      };
                    } else {
                      return {
                        ...prev,
                        poiTypeIds: [...poiTypeIds, value],
                      };
                    }
                  });
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className='flex flex-row gap-[20px] flex-wrap'>
        <span className='w-[100px]'>등급</span>
        <div className='flex flex-row gap-[20px] flex-wrap w-[calc(100%-120px)]'>
          {Object.entries(POI_GRADES).map(([label, value]) => (
            <label key={`poi-grade_${label}`} className='flex gap-[5px]'>
              <input
                type='checkbox'
                className='scale-125'
                checked={form.poiGrades.includes(value)}
                onChange={() => {
                  setForm((prev) => {
                    const poiGrades = prev.poiGrades;
                    if (poiGrades.includes(value)) {
                      return {
                        ...prev,
                        poiGrades: poiGrades.filter((id) => id !== value),
                      };
                    } else {
                      return {
                        ...prev,
                        poiGrades: [...poiGrades, value],
                      };
                    }
                  });
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className='w-full mt-[50px] flex items-center justify-center gap-[20px]'>
        <button
          className='text-white bg-blue-950 px-[20px] py-[10px] rounded-[6px]'
          onClick={() => {
            const resetResult = window.confirm(
              '검색 조건이 모두 초기화 하시겠습니까 ?'
            );
            if (resetResult) setForm(INIT_FORM);
          }}
        >
          값 초기화
        </button>
        <button
          className='text-white bg-blue-600 px-[20px] py-[10px] rounded-[6px]'
          onClick={() => {
            console.log(JSON.stringify(form, null, 2));
          }}
        >
          검색
        </button>
      </div>
    </div>
  );
}
