import React, { useState, useEffect, useRef, Component } from 'react';
import styled from 'styled-components';

const OverlayWrapper = styled.div`
	position: absolute;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 255, 0);
	display: ${(props) => (props.show ? 'block' : 'none')};
`;

const FlexWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	width: 100vw;
	height: 100vh;
`;

const VideoIFrame = styled.iframe`
	width: 70vw;
	height: 70vh;
`;

const Title = styled.h1`color: blue;`;

const CloseOverlay = styled.p`
	color: blue;
	cursor: pointer;
`

const Overlay = (props) => {
	const onClick = () => {
		props.hide();
	};
	return (
		<OverlayWrapper show={props.show} >

				
			<FlexWrapper>
				{/*  Render Title */}
				{props.project ? <Title>{props.project.title} </Title> : null}

				{/*  Render Video element */}

				{props.project && props.project.type == 'VIDEO' && props.project.video_url ? (
					<VideoIFrame
						src={props.project.video_url}
						title={props.project.title}
						frameBorder="0"
						allowFullScreen={true}
					/>
				) : null}
                <CloseOverlay onClick={() => onClick()}> close </CloseOverlay>
			</FlexWrapper>
		</OverlayWrapper>
	);
};

export default Overlay;
