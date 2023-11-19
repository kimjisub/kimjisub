import React from 'react';
import styled from 'styled-components';

interface TableProps {
  data: React.ReactNode[][];
  colRatio: number[];
}

const TableTitle = ({ data, colRatio }: TableProps) => {
  const total = colRatio.reduce((acc, cur) => acc + cur, 0);
  return (
    <StyledTable>
      <tbody>
        {data.map((rowData, rowIndex) => (
          <tr key={rowIndex}>
            {rowData.map((item, colIndex) => (
              <td
                key={colIndex}
                style={{
                  width: `${(colRatio[colIndex] / total) * 100}%`,
                }}>
                {item instanceof Array ? (
                  <div>
                    {item.map((subItem, subIndex) => (
                      <div key={subIndex}>{subItem}</div>
                    ))}
                  </div>
                ) : (
                  item
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

const StyledTable = styled.table`
  display: table;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 2em;

  border-top: 0.125em solid #333333;
  border-bottom: 0.125em solid #333333;

  tbody {
    tr {
      border: none;
      border-bottom: 0.0625em solid #d7d7d7;

      &:nth-child(2n) {
        background-color: #ffffff;
      }
      &:last-child {
        border-bottom: none;
      }
    }

    td {
      border: none;
      border-right: 0.0625em dashed #d7d7d7;
      padding: 0.5rem;

      &:last-child {
        border-right: none;
      }
    }
  }
`;

export default TableTitle;
