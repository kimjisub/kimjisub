'use client';

import React, { useEffect, useState } from 'react';

export default function MaintainingBar() {
	const [hide, setHide] = useState(false);

	if (hide) {
		return null;
	}

	return (
		<div onClick={()=>setHide(true)}>
			<section className="flex content-center items-center justify-center bg-orange-500 p-4 text-white bg-opacity-80">
				🚧 아직 개발이 진행중입니다. 일부 레이아웃이 정상적으로 표시되지 않을 수
				있습니다.
			</section>
		</div>
	);
}
