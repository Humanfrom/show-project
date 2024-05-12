import { useMemo } from 'react'

export const useSortedBoxes = (boxes, sort) => {
  const sortedBoxes = useMemo(() => {

    switch (sort) {
        case "name-up":
          return [...boxes].sort((a,b) => a.title.localeCompare(b.title));
        case "name-down":
          return [...boxes].sort((a,b) => a.title.localeCompare(b.title)).reverse();
        case "cost-up":
          return boxes.map( box => ({ ...box, sort_cost: Object.values(box.costs)[0] || Number.POSITIVE_INFINITY})).sort((a,b) => a.sort_cost - b.sort_cost);
        case "cost-down":
          return boxes.map( box => ({ ...box, sort_cost: Object.values(box.costs)[0] || Number.POSITIVE_INFINITY})).sort((a,b) => b.sort_cost - a.sort_cost);
        default:
          return boxes;
    }
  },[ sort, boxes])

  return sortedBoxes;
}

export const useBoxes = (boxes, sort, query) => {
    const sortedBoxes = useSortedBoxes(boxes,sort);
    const sortedAndSearchedBoxes = useMemo(() => {
      return sortedBoxes.filter(box => box.title.toLowerCase().includes(query.toLowerCase()))
    }, [ query, sortedBoxes ]);

    return sortedAndSearchedBoxes;
}