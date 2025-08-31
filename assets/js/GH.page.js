    const loanRange2 = document.getElementById("loanRange2");
    const loanValue2 = document.getElementById("loanValue2");
    const installment2 = document.getElementById("installment2");
    const interest2 = document.getElementById("interest2");
    const totalInstallments2 = document.getElementById("totalInstallments2");
    const supplier2 = document.getElementById("supplier2");
    const finalPayment2 = document.getElementById("finalPayment2");

    const loanData2 = {
    5000000: {
    installment: 470382,
    interest: 644581,
    total: 5644581,
    supplier: 550000,
    final: 6194581,
},
    10000000: {
    installment: 940764,
    interest: 1289160,
    total: 11289160,
    supplier: 1100000,
    final: 12389160,
},
    15000000: {
    installment: 1411145,
    interest: 1933739,
    total: 16933739,
    supplier: 1650000,
    final: 18583739,
},
    20000000: {
    installment: 1881527,
    interest: 2578318,
    total: 22578318,
    supplier: 2200000,
    final: 24778318,
},
    25000000: {
    installment: 2351909,
    interest: 3222898,
    total: 28222898,
    supplier: 2750000,
    final: 30972898,
},
    30000000: {
    installment: 2822290,
    interest: 3867477,
    total: 33867477,
    supplier: 3300000,
    final: 37167477,
},
    35000000: {
    installment: 3292673,
    interest: 4512056,
    total: 39512056,
    supplier: 3850000,
    final: 43362056,
},
    40000000: {
    installment: 3763053,
    interest: 5156635,
    total: 45156636,
    supplier: 4400000,
    final: 49556636,
},
    45000000: {
    installment: 4233436,
    interest: 5801215,
    total: 50801215,
    supplier: 4950000,
    final: 55751215,
},
    50000000: {
    installment: 4703818,
    interest: 6445794,
    total: 56445794,
    supplier: 5500000,
    final: 61945794,
},
};

    function formatNumber(num) {
    return num.toLocaleString('en-US');
}

    function updateCalculator2(value) {
    loanValue2.innerText = formatNumber(value) + " تومان";

    if (loanData2[value]) {
    installment2.innerText = formatNumber(loanData2[value].installment) + " تومان";
    interest2.innerText = formatNumber(loanData2[value].interest) + " تومان";
    totalInstallments2.innerText = formatNumber(loanData2[value].total) + " تومان";
    supplier2.innerText = formatNumber(loanData2[value].supplier) + " تومان";
    finalPayment2.innerText = formatNumber(loanData2[value].final) + " تومان";
} else {
    installment2.innerText = "—";
    interest2.innerText = "—";
    totalInstallments2.innerText = "—";
    supplier2.innerText = "—";
    finalPayment2.innerText = "—";
}
}

    loanRange2.addEventListener("input", (e) => {
    updateCalculator2(Number(e.target.value));
});

    updateCalculator2(5000000);

    const loanRange = document.getElementById('loanRange');
    const loanValue = document.getElementById('loanValue');
    const finalRepayment = document.getElementById('finalRepayment');
    const monthlyPayment = document.getElementById('monthlyPayment');
    const interestAmount = document.getElementById('interestAmount');
    const totalInstallments = document.getElementById('totalInstallments');
    const supplierShare = document.getElementById('supplierShare');

    const totalInstallmentsData = {
    5000000: 5644581,
    10000000: 11289160,
    15000000: 16933739,
    20000000: 22578318,
    25000000: 28222898,
    30000000: 33867477,
    35000000: 39512056,
    40000000: 45156636,
    45000000: 50801215,
    50000000: 56445794
};

    const supplierShareData = {
    5000000: 577500,
    10000000: 1155000,
    15000000: 1732500,
    20000000: 2310000,
    25000000: 2887500,
    30000000: 3465000,
    35000000: 4042500,
    40000000: 4620000,
    45000000: 5197500,
    50000000: 5775000
};

    function formatNumber(num) {
    return num.toLocaleString('en-US');
}

    function calculateFinalRepayment(loanAmount) {
    const amounts = {
    5000000: 6222081,
    10000000: 12384160,
    15000000: 18576239,
    20000000: 24768318,
    25000000: 30960398,
    30000000: 37152477,
    35000000: 43344557,
    40000000: 49536636,
    45000000: 55728716,
    50000000: 61920795
};
    return amounts[loanAmount] || loanAmount;
}

    function calculateMonthlyPayment(loanAmount) {
    const amounts = {
    5000000: 470382,
    10000000: 940764,
    15000000: 1411145,
    20000000: 1881527,
    25000000: 2351909,
    30000000: 2822290,
    35000000: 3292672,
    40000000: 3763053,
    45000000: 4233435,
    50000000: 4703817
};
    return amounts[loanAmount] || 0;
}

    function calculateInterest(loanAmount) {
    const amounts = {
    5000000: 644581,
    10000000: 1289160,
    15000000: 1933739,
    20000000: 2578318,
    25000000: 3222898,
    30000000: 3867477,
    35000000: 4512056,
    40000000: 5156635,
    45000000: 5801214,
    50000000: 6445794
};
    return amounts[loanAmount] || 0;
}

    function updateValues() {
    const loan = parseInt(loanRange.value);
    loanValue.textContent = formatNumber(loan) + ' تومان';

    const final = calculateFinalRepayment(loan);
    finalRepayment.textContent = formatNumber(final) + ' تومان';

    const monthly = calculateMonthlyPayment(loan);
    monthlyPayment.textContent = formatNumber(monthly) + ' تومان';

    const interest = calculateInterest(loan);
    interestAmount.textContent = formatNumber(interest) + ' تومان';

    totalInstallments.textContent = formatNumber(totalInstallmentsData[loan]) + ' تومان';
    supplierShare.textContent = formatNumber(supplierShareData[loan]) + ' تومان';
}

    loanRange.addEventListener('input', updateValues);
    updateValues();
