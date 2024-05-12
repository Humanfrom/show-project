export const matchArrays = (a, b) => {
    for (const item of b) {
        if (a.includes(item)) {
            return true;
        }
    }
    return false;
}

export const filterBoxByMask = ( boxes, mask ) => {
    
    const newBoxes = boxes.map( box => {
        let params = {
            costs: {},
            weights: {}
        };

        for (let pack in box.costs) {
            if(box.costs[pack] >= mask.costs.from && box.costs[pack] <= mask.costs.to ){
                params.costs[pack] = box.costs[pack];
                params.weights[pack] = box.weights[pack];
            }
        }

        return {...box, ...params}
    }).filter( box => {
        const teaClasses = !mask.classes.length || matchArrays(mask.classes, box.teas.map(tea => tea.class))
        const weights = !mask.weights.length || matchArrays(mask.weights, Object.keys(box.weights))
        const levels = !mask.levels.length || mask.levels.includes(box.level);
        const promos = !mask.promotions.length || matchArrays(mask.promotions, Object.keys(box.promotion));
        const access = !mask.onlyAccess || box.access;
        const achievements = !mask.onlyAchievements || box.achievements.length;
        
        return teaClasses && weights && Object.keys(box.costs).length && levels && promos && access && achievements
    })
    return newBoxes;
}

export const validateFields = (data) => {
    return Object.values(data)
      .filter((item) => item.validation)
      .some((item) => item.value === "");
  };
