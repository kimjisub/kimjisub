import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description:
		'김지섭이 운영하는 개인 자동화 에이전트가 Google 사용자 데이터를 어떻게 다루는지에 대한 개인정보처리방침.',
	openGraph: {
		title: 'Privacy Policy | Jisub Kim',
		description: '개인 자동화 에이전트의 Google 사용자 데이터 처리 방침.',
	},
};

const LAST_UPDATED = '2026년 9월 18일';

export default function PrivacyPolicyPage() {
	return (
		<main className="mx-auto w-full max-w-3xl px-6 py-16">
			<h1 className="text-3xl font-bold">개인정보처리방침</h1>
			<p className="mt-2 text-sm opacity-70">최종 수정일: {LAST_UPDATED}</p>

			<div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
				<h2>1. 개요</h2>
				<p>
					이 방침은 김지섭(이하 &ldquo;운영자&rdquo;)이 개인 용도로 운영하는 자동화 에이전트
					애플리케이션에 적용됩니다. 이 애플리케이션은 운영자 본인의 업무 워크플로를 자동화하기
					위해 만들어졌으며, 일반 대중에게 서비스를 제공하지 않습니다.
				</p>

				<h2>2. 접근하는 정보</h2>
				<p>
					이 애플리케이션은 Google OAuth 2.0을 통해 사용자가 명시적으로 동의한 범위에서만 다음
					데이터에 접근합니다.
				</p>
				<ul>
					<li>Gmail 메시지의 읽기, 라벨 변경, 발송</li>
					<li>Google Calendar 일정의 조회 및 생성·수정</li>
					<li>Google Drive 파일의 조회 및 관리</li>
					<li>Google Docs 및 Sheets 문서의 조회 및 편집</li>
					<li>연락처 정보의 읽기</li>
				</ul>
				<p>
					접근 권한은 사용자가 동의 화면에서 승인한 범위로 제한되며, 승인하지 않은 범위의
					데이터에는 접근하지 않습니다.
				</p>

				<h2>3. 이용 목적</h2>
				<p>
					수집된 데이터는 운영자 본인의 일정 관리, 메일 정리, 문서 작성 보조 등 개인 생산성
					자동화 목적으로만 사용됩니다. 광고, 프로파일링, 모델 학습, 판매 또는 그 밖의 2차적
					목적으로 사용하지 않습니다.
				</p>

				<h2>4. 저장과 보관</h2>
				<p>
					데이터는 운영자가 직접 관리하는 개인 기기에 저장되며, 처리에 필요한 기간 동안만
					보관됩니다. 인증 토큰은 해당 기기의 보호된 저장소에 보관되고, 연동을 해제하면 즉시
					폐기됩니다.
				</p>

				<h2>5. 제3자 제공</h2>
				<p>
					이 애플리케이션은 Google 사용자 데이터를 제3자에게 판매하거나 양도하지 않습니다.
					데이터는 위 목적을 수행하는 데 필요한 범위를 넘어 외부로 전송되지 않습니다.
				</p>

				<h2>6. Google API Services User Data Policy</h2>
				<p>
					이 애플리케이션이 Google API로부터 받은 정보의 사용 및 다른 앱으로의 전송은, 제한적
					사용 요건(Limited Use requirements)을 포함한 <em>Google API Services User Data Policy</em>
					를 준수합니다.
				</p>

				<h2>7. 접근 권한 철회</h2>
				<p>
					사용자는 언제든지 Google 계정 설정의 보안 &gt; 타사 앱 및 서비스 메뉴에서 이
					애플리케이션의 접근 권한을 철회할 수 있습니다. 철회 시 저장된 토큰은 더 이상 유효하지
					않으며 데이터 접근이 즉시 중단됩니다.
				</p>

				<h2>8. 문의</h2>
				<p>
					이 방침에 대한 문의는 <a href="mailto:0226daniel@gmail.com">0226daniel@gmail.com</a> 으로
					보내주시기 바랍니다.
				</p>

				<h2>9. 변경</h2>
				<p>
					이 방침이 변경되는 경우 이 페이지에 수정된 내용과 최종 수정일을 게시합니다.
				</p>
			</div>
		</main>
	);
}
