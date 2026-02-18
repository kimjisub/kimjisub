'use client';
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import * as d3 from 'd3';

// D3의 SimulationNodeDatum을 확장
interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  svg: React.JSX.Element;
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
      .force('charge', d3.forceManyBody().strength(-500))
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
      .append('foreignObject') // foreignObject 사용
      .attr('width', 50) // React 컴포넌트를 렌더링할 공간
      .attr('height', 50)
      // .attr('x', -25)
      // .attr('y', -25)
      .attr('transform', () => `translate(${-25}, ${-25})`)
      // .attr('id', d => d.id)
      .each(function (d) {
        ReactDOM.createRoot(this).render(d.svg);
      })
      // .append('circle')
      // .attr('r', 10)
      // .attr('fill', '#69b3a2')
      .call(
        d3
          .drag<SVGForeignObjectElement, Node>() // 타입을 SVGForeignObjectElement로 설정
          .on(
            'start',
            (
              event: d3.D3DragEvent<SVGForeignObjectElement, Node, Node>,
              d: Node,
            ) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            },
          )
          .on(
            'drag',
            (
              event: d3.D3DragEvent<SVGForeignObjectElement, Node, Node>,
              d: Node,
            ) => {
              d.fx = event.x;
              d.fy = event.y;
            },
          )
          .on(
            'end',
            (
              event: d3.D3DragEvent<SVGForeignObjectElement, Node, Node>,
              d: Node,
            ) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            },
          ),
      );

    // 텍스트 라벨 추가
    // const labels = svg
    //   .append('g')
    //   .selectAll('text')
    //   .data(data.nodes)
    //   .enter()
    //   .append('text')
    //   .attr('dy', 4)
    //   .attr('dx', 12)
    //   .text(d => d.name)
    //   .attr('font-size', '12px');

    // 줌 그룹 생성 (모든 콘텐츠를 포함할 그룹)
    const zoomGroup = svg.append('g');

    // 줌 핸들러 설정
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5]) // 줌 범위 설정 (0.5배 ~ 5배)
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        zoomGroup.attr('transform', event.transform.toString()); // 확대/축소 및 팬 적용
      });

    svg.call(zoom);

    // 시뮬레이션 진행 시 위치 업데이트
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as unknown as Node).x!)
        .attr('y1', d => (d.source as unknown as Node).y!)
        .attr('x2', d => (d.target as unknown as Node).x!)
        .attr('y2', d => (d.target as unknown as Node).y!);

      node.attr('x', d => d.x!).attr('y', d => d.y!);

      // labels.attr('x', d => d.x!).attr('y', d => d.y!);
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
