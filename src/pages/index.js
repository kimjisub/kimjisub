import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'
import ReactTypingEffect from 'react-typing-effect'
import { Typography } from '@mui/material'
import TimeLine from '../components/TimeLine'
import Skills from '../components/Skills'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function Introduce() {
	const { siteConfig } = useDocusaurusContext()
	return (
		<header className={clsx('hero ', styles.heroBanner, styles.fullheight)}>
			<div className="container">
				<p className="hero__subtitle">
					<Typography variant="subtitle1" gutterBottom component="span">
						개발자
					</Typography>
					<Typography variant="h2" component="span" gutterBottom>
						김지섭
					</Typography>
					<Typography variant="body1" component="span" gutterBottom>
						을 소개할게요
					</Typography>
				</p>
				<div className={styles.buttons}>
					<Link
						className="button button--secondary button--lg"
						to="/docs/intro"
					>
						포트폴리오
					</Link>

					<Link
						className="button button--secondary button--lg"
						to="/docs/intro"
					>
						블로그
					</Link>
				</div>
			</div>
		</header>
	)
}

export default function Home() {
	const { siteConfig } = useDocusaurusContext()

	const list = [
		{
			year: 2016,
			title: 'UniPad 프로젝트 진행',
			content:
				'안드로이드 기반 음악게임으로, 플레이스토어에서 500+만 다운로드 달성.',
		},
		{
			year: null,
			title: '정보올림피아드 공모부문 전국 금상 수상',
			content: 'UniPad 프로젝트',
		},
		{
			year: 2017,
			title: (
				<>
					<span style={{ color: '#D31877' }}> 한국디지털미디어고등학교 </span>
					16기 해킹방어과 입학
				</>
			),
			content: 'IT 특성화고',
		},
		{
			year: 2018,
			title: (
				<>
					교내 인트라넷 <span style={{ color: '#D31877' }}> 디미고라이프 </span>
					개발 및 운영
				</>
			),
			content:
				'기숙사 생활에 있어서 필요한 각종 신청서들을 전산화시켜 효율적인 학교 생활을 할 수 있도록 하였어요.',
		},
		{
			year: 2019,
			title: (
				<>
					스타트업 <span style={{ color: '#DC4744' }}>The Vplanet</span> 입사
				</>
			),
			content:
				'안드로이드, API 서버, After Effect를 이용한 렌더링 엔진 등 다양한 것들을 개발했어요.',
		},
		{
			year: null,
			title: 'IT 창업 경진 대회 및 해커톤 18여 회 수상',
			content: '다양한 대회를 나가며 아이템 기획과 프로토타입 개발을 했어요.',
		},
		{
			year: 2020,
			title: '한국외국어대학교 20학번 컴퓨터공학부 입학',
			content:
				'더 많은 것들을 배우고 성장해나가기 위해서 한국외대 컴공과에 입학했어요.',
		},
		{
			year: 2021,
			title: 'ROKA 체계운용정비병 군 복무',
			content:
				'네트워크 운용/정비병으로 지원해 각종 체계 업무를 맡으며 효율적인 일 처리를 위해 힘쓰고 있어요.',
		},
	]

	return (
		<Layout
			className="root"
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />"
		>
			<Introduce />
			<main>
				<TimeLine list={list}></TimeLine>
				<Skills />
			</main>
		</Layout>
	)
}
