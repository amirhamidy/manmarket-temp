document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    const chatList = document.getElementById('chatList');
    const chatOverlay = document.getElementById('chatOverlay');
    const messageArea = document.getElementById('messageArea');
    const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');

    if (mobileMenuIcon && chatList && chatOverlay) {
        mobileMenuIcon.addEventListener('click', () => {
            chatList.classList.toggle('is-open');
            chatOverlay.classList.toggle('is-visible');
            document.body.classList.toggle('no-scroll');
        });

        chatOverlay.addEventListener('click', () => {
            chatList.classList.remove('is-open');
            chatOverlay.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
        });

        document.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                if (chatList.classList.contains('is-open')) {
                    chatList.classList.remove('is-open');
                    chatOverlay.classList.remove('is-visible');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    if (messageArea && scrollToBottomBtn) {
        const scrollToBottom = () => {
            messageArea.scrollTo({
                top: messageArea.scrollHeight,
                behavior: 'smooth'
            });
        };

        const toggleScrollButton = () => {
            if (messageArea.scrollHeight > messageArea.clientHeight &&
                messageArea.scrollTop < messageArea.scrollHeight - messageArea.clientHeight - 20) {
                scrollToBottomBtn.style.opacity = '1';
                scrollToBottomBtn.style.visibility = 'visible';
                scrollToBottomBtn.style.transform = 'translateY(0)';
            } else {
                scrollToBottomBtn.style.opacity = '0';
                scrollToBottomBtn.style.visibility = 'hidden';
                scrollToBottomBtn.style.transform = 'translateY(10px)';
            }
        };

        messageArea.addEventListener('scroll', toggleScrollButton);
        scrollToBottomBtn.addEventListener('click', scrollToBottom);

        scrollToBottom();
        toggleScrollButton();
    }
});