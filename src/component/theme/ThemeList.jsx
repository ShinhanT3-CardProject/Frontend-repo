import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'asset/css/carousel.css';
const ThemeList = ({ themes, moveToDetail, getThemeBackgroundImage }) => {

    // 페이지가 다시 로드될 때마다 고유한 키 값을 부여하여 Carousel이 다시 렌더링되도록 함
    const [carouselKey, setCarouselKey] = useState(0);

    useEffect(() => {
        // 페이지로 돌아올 때마다 키를 증가시켜 Carousel 재생성을 유도
        setCarouselKey(prevKey => prevKey + 1);
    }, [themes]);

    return (
        <Carousel
            key={carouselKey}  // key 속성을 사용하여 강제 리렌더링 유도
            showArrows={false}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            interval={3000}
            stopOnHover={true}
        >
            {themes.map(theme => (
                <div key={theme.themeId} onClick={() => moveToDetail(theme.themeId)}>
                    <div className="themeThumbnail">
                        <img src={getThemeBackgroundImage(theme.themeBackground)} alt={theme.themeName} />
                    </div>
                    <span className='themeTitle'>{theme.themeName}</span>
                </div>
            ))}
        </Carousel>
    );
};

export default ThemeList;
