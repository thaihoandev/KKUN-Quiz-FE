function debounce(t, a) {
    let c;
    return (...e) => {
        clearTimeout(c), (c = setTimeout(() => t.apply(this, e), a));
    };
}
document.addEventListener("DOMContentLoaded", () => {
    let c = {
            chatContactsBody: document.querySelector(
                ".app-chat-contacts .sidebar-body",
            ),
            chatHistoryBody: document.querySelector(".chat-history-body"),
            chatSidebarLeftBody: document.querySelector(
                ".app-chat-sidebar-left .sidebar-body",
            ),
            chatSidebarRightBody: document.querySelector(
                ".app-chat-sidebar-right .sidebar-body",
            ),
            chatUserStatus: [
                ...document.querySelectorAll(
                    ".form-check-input[name='chat-user-status']",
                ),
            ],
            chatSidebarLeftUserAbout: document.getElementById(
                "chat-sidebar-left-user-about",
            ),
            formSendMessage: document.querySelector(".form-send-message"),
            messageInput: document.querySelector(".message-input"),
            searchInput: document.querySelector(".chat-search-input"),
            chatContactListItems: [
                ...document.querySelectorAll(
                    ".chat-contact-list-item:not(.chat-contact-list-item-title)",
                ),
            ],
            textareaInfo: document.getElementById("textarea-maxlength-info"),
            conversationButton: document.getElementById(
                "app-chat-conversation-btn",
            ),
            chatHistoryHeader: document.querySelector(
                ".chat-history-header [data-target='#app-chat-contacts']",
            ),
            speechToText: $(".speech-to-text"),
            appChatConversation: document.getElementById(
                "app-chat-conversation",
            ),
            appChatHistory: document.getElementById("app-chat-history"),
        },
        a = {
            active: "avatar-online",
            offline: "avatar-offline",
            away: "avatar-away",
            busy: "avatar-busy",
        };
    let o = () =>
        c.chatHistoryBody?.scrollTo(0, c.chatHistoryBody.scrollHeight);
    function e(e, t, a) {
        var e = e.value.length,
            c = a - e;
        (t.className = "maxLength label-success"),
            0 <= c && (t.textContent = e + "/" + a),
            c <= 0 &&
                ((t.textContent = e + "/" + a),
                t.classList.remove("label-success"),
                t.classList.add("label-danger"));
    }
    let t = () => {
            c.appChatConversation.classList.replace("d-flex", "d-none"),
                c.appChatHistory.classList.replace("d-none", "d-block");
        },
        s = (e, a, t) => {
            e = document.querySelectorAll(
                e + ":not(.chat-contact-list-item-title)",
            );
            let c = 0;
            e.forEach((e) => {
                var t = e.textContent.toLowerCase().includes(a);
                e.classList.toggle("d-flex", t),
                    e.classList.toggle("d-none", !t),
                    t && c++;
            }),
                document.querySelector(t)?.classList.toggle("d-none", 0 < c);
        };
    [
        c.chatContactsBody,
        c.chatHistoryBody,
        c.chatSidebarLeftBody,
        c.chatSidebarRightBody,
    ].forEach((e) => {
        e &&
            new PerfectScrollbar(e, {
                wheelPropagation: !1,
                suppressScrollX: !0,
            });
    }),
        o(),
        c.chatUserStatus.forEach((e) => {
            e.addEventListener("click", () => {
                var t;
                (t = e.value),
                    [
                        document.querySelector(
                            ".chat-sidebar-left-user .avatar",
                        ),
                        document.querySelector(".app-chat-contacts .avatar"),
                    ].forEach((e) => {
                        e &&
                            (e.className = e.className.replace(
                                /avatar-\w+/,
                                a[t],
                            ));
                    });
            });
        });
    let r = parseInt(c.chatSidebarLeftUserAbout.getAttribute("maxlength"), 10);
    e(c.chatSidebarLeftUserAbout, c.textareaInfo, r),
        c.chatSidebarLeftUserAbout.addEventListener("input", () => {
            e(c.chatSidebarLeftUserAbout, c.textareaInfo, r);
        }),
        c.conversationButton?.addEventListener("click", t),
        c.chatContactListItems.forEach((e) => {
            e.addEventListener("click", () => {
                c.chatContactListItems.forEach((e) =>
                    e.classList.remove("active"),
                ),
                    e.classList.add("active"),
                    t();
            });
        }),
        c.searchInput?.addEventListener(
            "keyup",
            debounce((e) => {
                e = e.target.value.toLowerCase();
                s("#chat-list li", e, ".chat-list-item-0"),
                    s("#contact-list li", e, ".contact-list-item-0");
            }, 300),
        ),
        c.formSendMessage?.addEventListener("submit", (e) => {
            e.preventDefault();
            var t,
                e = c.messageInput.value.trim();
            e &&
                (((t = document.createElement("div")).className =
                    "chat-message-text mt-2"),
                (t.innerHTML = `<p class="mb-0 text-break">${e}</p>`),
                document
                    .querySelector("li:last-child .chat-message-wrapper")
                    ?.appendChild(t),
                (c.messageInput.value = ""),
                o());
        }),
        c.chatHistoryHeader?.addEventListener("click", () => {
            document
                .querySelector(".app-chat-sidebar-left .close-sidebar")
                ?.removeAttribute("data-overlay");
        }),
        (() => {
            var a = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (a && 0 !== c.speechToText.length) {
                let e = new a(),
                    t = !1;
                c.speechToText.on("click", function () {
                    t || e.start(),
                        (e.onspeechstart = () => (t = !0)),
                        (e.onresult = (e) => {
                            $(this)
                                .closest(".form-send-message")
                                .find(".message-input")
                                .val(e.results[0][0].transcript);
                        }),
                        (e.onspeechend = () => (t = !1)),
                        (e.onerror = () => (t = !1));
                });
            }
        })();
});
