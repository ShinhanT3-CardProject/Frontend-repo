import React from 'react';
import 'asset/css/ThemeResultPage.css'; // 위에서 작성한 CSS 파일

function ThemedBalloons({ reasons }) {
    const balloonClasses = ['left', 'right', 'yellow', 'pink', 'blue'];

    return (
        <div className="balloons-container">
            {reasons.map((reason, index) => (
                <div
                    key={index}
                    className={`balloon ${balloonClasses[index % balloonClasses.length]}`}
                >
                    {reason}
                </div>
            ))}
        </div>
    );
}

export default ThemedBalloons;

