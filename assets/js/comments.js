
const OneForm = document.querySelector('.one-form');
const TwoForm = document.querySelector('.two-form');
const More = document.querySelector('.more');
const Comment = document.querySelector('.comment')
const BackOne = document.querySelector('.back-to-one')
const CsOverlay = document.querySelector('.custom-overlay')


Comment.addEventListener('click' , () =>{
    OneForm.style.visibility = 'visible'
    OneForm.style.opacity = '1'
    CsOverlay.style.opacity = '1'
    CsOverlay.style.visibility = 'visible'
})
More.addEventListener('click', () => {
    TwoForm.style.visibility = 'visible';
    TwoForm.style.opacity = '1'
    OneForm.style.visibility = 'hidden';
    OneForm.style.opacity = '0'
});
CsOverlay.addEventListener('click' , () =>{
    OneForm.style.visibility = 'hidden';
    TwoForm.style.visibility = 'hidden';
    TwoForm.style.opacity = '0'
    OneForm.style.opacity = '0'
    CsOverlay.style.visibility = 'hidden';
    CsOverlay.style.opacity = '0'
})
BackOne.addEventListener('click' , () =>{
    OneForm.style.visibility = 'visible'
    OneForm.style.opacity = '1'
    TwoForm.style.visibility = 'hidden';
    TwoForm.style.opacity = '0'
})
document.getElementById('user-name').addEventListener('change', updateUserComment);
document.getElementById('man-name').addEventListener('change', updateUserComment);


function updateUserComment() {
    const userNameInput = document.getElementById('user-name');
    const manNameInput = document.getElementById('man-name');
    const commentElement = document.querySelector('.user-comment');

    if (userNameInput.checked) {
        commentElement.textContent = 'امیر رضا';
    } else if (manNameInput.checked) {
        commentElement.textContent = 'کاربر من مارکت';
    } else {
        commentElement.textContent = '';
    }
}


document.querySelector('.navi').addEventListener('click', function() {
    const codeElement = document.querySelector('.code');
    const codeText = codeElement.textContent;
    const TrCode = document.querySelector('.true-c');
    const number = codeText.match(/\d+/);

    if (number) {
        navigator.clipboard.writeText(number[0])
            .then(() => {
                document.querySelector('.navi').style.display = 'none';
                TrCode.style.display = 'inline-block';
            })
            .catch(err => {
                console.error('خطا در کپی:', err);
            });
    } else {
        alert('هیچ عددی یافت نشد.');
    }
});


