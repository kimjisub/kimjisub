'use client';
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// D3의 SimulationNodeDatum을 확장
interface Node extends d3.SimulationNodeDatum {
	id: string;
	name: string;
}

interface Link {
	source: string;
	target: string;
}

interface GraphData {
	nodes: Node[];
	links: Link[];
}

interface ForceGraphProps {
	data: GraphData;
}

const ForceGraph: React.FC<ForceGraphProps> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove(); // 기존 SVG 초기화

		const width = window.innerWidth;
		const height = window.innerHeight;

		// Force Simulation 초기화
		const simulation = d3
			.forceSimulation<Node>(data.nodes)
			.force(
				'link',
				d3
					.forceLink<Node, Link>(data.links)
					.id(d => d.id)
					.distance(100),
			)
			.force('charge', d3.forceManyBody().strength(-300))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('x', d3.forceX(width / 2).strength(0.1)) // X 축 제한
			.force('y', d3.forceY(height / 2).strength(0.1)); // Y 축 제한

		// 링크 생성
		const link = svg
			.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(data.links)
			.enter()
			.append('line')
			.attr('stroke', '#999')
			.attr('stroke-width', 1.5);

		// 노드 생성
		const node = svg
			.append('g')
			.attr('class', 'nodes')
			.selectAll('circle')
			.data(data.nodes)
			.enter()
			.append('circle')
			.attr('r', 10)
			.attr('fill', '#69b3a2')
			.call(
				d3
					.drag<SVGCircleElement, Node>()
					.on('start', (event, d) => {
						if (!event.active) simulation.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on('drag', (event, d) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on('end', (event, d) => {
						if (!event.active) simulation.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					}),
			);

		// 텍스트 라벨 추가
		const labels = svg
			.append('g')
			.selectAll('text')
			.data(data.nodes)
			.enter()
			.append('text')
			.attr('dy', 4)
			.attr('dx', 12)
			.text(d => d.name)
			.attr('font-size', '12px');

		// 시뮬레이션 진행 시 위치 업데이트
		simulation.on('tick', () => {
			link
				.attr('x1', d => (d.source as unknown as Node).x!)
				.attr('y1', d => (d.source as unknown as Node).y!)
				.attr('x2', d => (d.target as unknown as Node).x!)
				.attr('y2', d => (d.target as unknown as Node).y!);

			node.attr('cx', d => d.x!).attr('cy', d => d.y!);

			labels.attr('x', d => d.x!).attr('y', d => d.y!);
		});

		// SVG 크기 설정
		svg.attr('width', width).attr('height', height);

		// 화면 크기 변경 이벤트
		const resizeHandler = () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			svg.attr('width', newWidth).attr('height', newHeight);

			simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
			simulation.force('x', d3.forceX(newWidth / 2).strength(0.1));
			simulation.force('y', d3.forceY(newHeight / 2).strength(0.1));
			simulation.alpha(0.3).restart();
		};

		window.addEventListener('resize', resizeHandler);
		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	}, [data]);

	return <svg ref={svgRef}></svg>;
};

export default ForceGraph;
