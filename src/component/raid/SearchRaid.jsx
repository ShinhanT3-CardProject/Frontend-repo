import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import 'asset/css/RaidSearch.css';

function SearchRaid(props) {
    const [raidList, setRaidList] = useState([]);
    const [searchRaid, setSearchRaid] = useState("");
    const [selected, setSelected] = useState("");
    const [options, setOptions] = useState([]);  // 옵션 데이터를 관리할 상태

    const [selectedData, setSelectedData] = useState(null);
    const [selectLocation, setSelectLocation] = useState(null);

    const key = process.env.REACT_APP_OPED_API_KEY;

    const navigate = useNavigate();

    // API 호출 후 옵션 데이터를 설정
    useEffect(() => {
        axios.get(`http://api.odcloud.kr/api/15063993/v1/uddi:e6b4e89e-5524-47ef-9db7-eedabf41ed29?page=1&perPage=26&serviceKey=${key}`)
            .then((response) => {
                const optionData = response.data.data.map(item => ({
                    value: item.기관명칭,
                    label: item.기관명칭
                }));
                setOptions(optionData);  // 상태에 옵션 데이터를 설정
            })
            .catch((error) => {
                console.log(error);
            });
    }, [key]);  // key가 변경될 때만 다시 실행

    // raidList 데이터를 가져오는 useEffect
    useEffect(() => {
        axios.get('/api/raid/raidList')
            .then((response) => {
                setRaidList(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);  

    // 입력된 검색어를 기준으로 필터링
    const filterRaid = raidList.filter((raidinfo) => (
        raidinfo.merchantAddress.includes(selectLocation === null ? '서울특별시' : selectLocation) && (
        raidinfo.merchantName.includes(searchRaid) ||
        raidinfo.merchantAddress.includes(searchRaid)
        )
    ));

    function selectRaid(raidId) {
        setSelectedData(raidList.find((selected) => (
            selected.raidId === raidId
        )));
        navigate(`/raidBattle/${raidId}`);
    }

    const onChange = (e) => {
        setSearchRaid(e.target.value);
    };

    const onChangeSelect = (e) => {
        if (e) setSelected(e.value);
        else setSelected('');
        setSelectLocation(e.value);
    };

    const customStyles: StylesConfig<OptionType, false> = {
        option: (provided, state) => ({
            ...provided,
            opacity: 0.8,
            padding: 20,

          }),
          menu: (provided) => ({
            ...provided,
            width: '50%',
            height: '200px',
          }),
          control: (provided) => ({
            ...provided,
            width: '50%',
            height: '50%',
            alignItem:'center',
            fontSize: 10,
          }),
          dropdownIndicator: (base, state) => ({
            ...base,
            width:'10%',
            float:'right',
            display:'inline-block',
            position:'relative'

          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: "none",
          }),
      };

    return (
        <div className='raid-search-wrapper'>
            <Select
                // styles={customStyles}
                onChange={onChangeSelect}
                options={options}  // useState로 관리되는 options를 사용
                placeholder='서울특별시'
                defaultValue='서울특별시'
            />
            <input 
                className='raid-search'
                style={{ backgroundColor:'#cbdeff36', fontSize:'12px', margin:'0 auto', marginTop:'4px', marginBottom:'4px', fontStyle:'italic', textAlign:'center'}} 
                placeholder='상호명 또는 주소를 입력하세요.🔎' 
                onChange={onChange} 
            />
            <ul className='raid-ul'>
            {filterRaid.map((item, index) => (
                <li onClick={() => selectRaid(item.raidId)} className="raidList" key={item.raidId}>
                    <p>{item.merchantName}</p>
                    <p>상세주소 : {item.merchantAddress}</p>
                    <hr/>
                </li>
            ))}
            </ul>
        </div>
    );
}

export default SearchRaid;
