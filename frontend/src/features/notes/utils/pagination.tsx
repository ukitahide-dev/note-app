



// 呼び出し元: Pagination.tsx、


export default function getDisplayPages  (
    totalPages: number,
    currentPage: number,

) {


    const displayPages: (number | string)[] = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);


    for (let i = start; i <= end; i++) {
        displayPages.push(i);
    }


    if (start > 2) {
        displayPages.unshift("...");
        displayPages.unshift(1);
    }

    if (start === 2) {
        displayPages.unshift(1);
    }


    if (end < totalPages - 1) {
        displayPages.push("...");
        displayPages.push(totalPages);
    }

    if (end === totalPages - 1) {
        displayPages.push(totalPages);
    }



    return displayPages;





}
