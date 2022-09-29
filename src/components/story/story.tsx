import React, { Component } from 'react';

import Stories from 'react-insta-stories';

const Story = () => {
    const stories = [
        'https://example.com/pic.jpg',
        'data:image/jpg;base64,R0lGODl....',
        'https://mohitkarekar.com/icon.png',
    ];
	return (
        <>		<Stories
			stories={stories}
			defaultInterval={1500}
			width={432}
			height={768}
		/>
        </>
	);
};
