(function () {
    const widget = document.createElement('div');
    widget.className = 'minna-chatbot-widget';
    widget.innerHTML = [
        '<button class="minna-chatbot-toggle" type="button" aria-label="Open chatbot">',
        '  <i class="fas fa-comments"></i>',
        '  <span>Ask MinNa</span>',
        '</button>',
        '<div class="minna-chatbot-panel" role="dialog" aria-label="MinNa assistant">',
        '  <div class="minna-chatbot-header">',
        '    <div class="minna-chatbot-title">',
        '      <strong>MinNa Assistant</strong>',
        '    </div>',
        '    <button class="minna-chatbot-close" type="button" aria-label="Close chatbot">',
        '      <i class="fas fa-times"></i>',
        '    </button>',
        '  </div>',
        '  <div class="minna-chatbot-body">',
        '    <div class="minna-chatbot-messages"></div>',
        '    <div class="minna-chatbot-suggestions"></div>',
        '    <form class="minna-chatbot-form">',
        '      <input class="minna-chatbot-input" type="text" placeholder="Type your question..." autocomplete="off" />',
        '      <button class="minna-chatbot-send" type="submit" aria-label="Send message">',
        '        <i class="fas fa-paper-plane"></i>',
        '      </button>',
        '    </form>',
        '  </div>',
        '</div>'
    ].join('');

    document.body.appendChild(widget);

    const toggleButton = widget.querySelector('.minna-chatbot-toggle');
    const closeButton = widget.querySelector('.minna-chatbot-close');
    const panel = widget.querySelector('.minna-chatbot-panel');
    const messages = widget.querySelector('.minna-chatbot-messages');
    const suggestions = widget.querySelector('.minna-chatbot-suggestions');
    const form = widget.querySelector('.minna-chatbot-form');
    const input = widget.querySelector('.minna-chatbot-input');

    const quickSuggestions = [
        'What does the lab do?',
        'Show me projects',
        'Where can I read publications?',
        'How do I contact you?'
    ];

    const maybeLinks = {
        projects: '../projects/featuredprojects.html',
        publications: '../publications.html',
        contact: '../contact.html',
        about: '../about/about.html',
        researchers: '../people/faculties.html',
        communities: '../people/kagan.html'
    };

    function getRelativePath(path) {
        const currentPath = window.location.pathname;
        const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const isInSubfolder = currentDir.includes('/people/') || currentDir.includes('/about/') || currentDir.includes('/projects/');
        if (!isInSubfolder && path.startsWith('../')) {
            return path.replace('../', '');
        }
        return path;
    }

    function addMessage(text, sender) {
        const message = document.createElement('div');
        message.className = `minna-chatbot-message ${sender}`;
        message.innerHTML = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    function detectLanguage(text) {
        const tagalogKeywords = ['kumusta', 'kamusta', 'magandang', 'paano', 'saan', 'ano', 'anong', 'tungkol', 'tulong', 'salamat', 'mga', 'proyekto', 'publikasyon', 'komunidad', 'kontak'];
        const cebuanoKeywords = ['unsa', 'asa', 'maayong', 'salamat', 'tabang', 'kinsa', 'kanus-a', 'unsa man', 'komunidad', 'publikasyon', 'proyekto', 'kontak'];

        if (containsAny(text, tagalogKeywords) && !containsAny(text, ['unsa', 'asa', 'maayong', 'tabang'])) {
            return 'tagalog';
        }

        if (containsAny(text, cebuanoKeywords)) {
            return 'cebuano';
        }

        return 'english';
    }

    function createReply(inputText) {
        const text = inputText.toLowerCase().trim();
        const language = detectLanguage(text);

        if (!text) {
            if (language === 'tagalog') {
                return 'Pakisulat ang tanong para matulungan ka sa pag-explore sa site.';
            }
            if (language === 'cebuano') {
                return 'Palihug isulat ang imong pangutana aron matabangan ka sa pag-explore sa site.';
            }
            return 'Please type a question so I can help you explore the site.';
        }

        const greeting = language === 'tagalog'
            ? 'Kumusta! Makakatulong ako sa pag-explore ng MinNa LProc, mga proyekto, publikasyon, researchers, at mga community pages.'
            : language === 'cebuano'
                ? 'Kumusta! Makahatag ako og tabang sa pag-explore sa MinNa LProc, mga proyekto, publikasyon, researchers, ug mga community pages.'
                : 'Hello! I can help you explore MinNa LProc, its projects, publications, researchers, and community pages.';

        if (containsAny(text, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'kumusta', 'kamusta', 'maayong buntag', 'maayong hapon', 'maayong gabie', 'magandang araw']) ) {
            return greeting;
        }

        const about = language === 'tagalog'
            ? 'Ang MinNa LProc ay nag-aaral ng natural language processing, language resources, at responsible AI para sa mga wika sa Pilipinas at low-resource languages, lalo na sa mga komunidad sa Mindanao.'
            : language === 'cebuano'
                ? 'Ang MinNa LProc nagtuon sa natural language processing, language resources, ug responsible AI para sa mga pinulongan sa Pilipinas ug low-resource languages, ilabina sa mga komunidad sa Mindanao.'
                : 'MinNa LProc researches natural language processing, language resources, and responsible AI for Philippine and low-resource languages, with a strong focus on Mindanao communities.';

        if (containsAny(text, ['what does the lab do', 'research', 'focus', 'about', 'tungkol', 'ano ang', 'unsa ang', 'unsa ka', 'lab', 'ano ang lab']) ) {
            return about;
        }

        const projects = language === 'tagalog'
            ? 'Pwede kang mag-browse sa featured projects dito: <a href="' + getRelativePath(maybeLinks.projects) + '" target="_blank" rel="noopener noreferrer">Featured projects</a>.'
            : language === 'cebuano'
                ? 'Pwede ka mag-browse sa featured projects dinhi: <a href="' + getRelativePath(maybeLinks.projects) + '" target="_blank" rel="noopener noreferrer">Featured projects</a>.'
                : 'You can browse the featured projects here: <a href="' + getRelativePath(maybeLinks.projects) + '" target="_blank" rel="noopener noreferrer">Featured projects</a>.';

        if (containsAny(text, ['project', 'projects', 'proyekto', 'proyekto']) ) {
            return projects;
        }

        const publications = language === 'tagalog'
            ? 'Ang publikasyon ay narito: <a href="' + getRelativePath(maybeLinks.publications) + '" target="_blank" rel="noopener noreferrer">Publications</a>.'
            : language === 'cebuano'
                ? 'Ang publikasyon anaa dinhi: <a href="' + getRelativePath(maybeLinks.publications) + '" target="_blank" rel="noopener noreferrer">Publications</a>.'
                : 'The publications page is here: <a href="' + getRelativePath(maybeLinks.publications) + '" target="_blank" rel="noopener noreferrer">Publications</a>.';

        if (containsAny(text, ['publication', 'publications', 'paper', 'papers', 'publikasyon', 'papel']) ) {
            return publications;
        }

        const contact = language === 'tagalog'
            ? 'Pwede kang makipag-ugnayan sa lab sa contact page: <a href="' + getRelativePath(maybeLinks.contact) + '" target="_blank" rel="noopener noreferrer">Contact us</a>.'
            : language === 'cebuano'
                ? 'Pwede ka maka-contact sa lab sa contact page: <a href="' + getRelativePath(maybeLinks.contact) + '" target="_blank" rel="noopener noreferrer">Contact us</a>.'
                : 'You can reach the lab through the contact page: <a href="' + getRelativePath(maybeLinks.contact) + '" target="_blank" rel="noopener noreferrer">Contact us</a>.';

        if (containsAny(text, ['contact', 'reach', 'email', 'help', 'kontak', 'tulong', 'email']) ) {
            return contact;
        }

        const researchers = language === 'tagalog'
            ? 'Pwede kang mag-explore sa mga people pages dito: <a href="' + getRelativePath(maybeLinks.researchers) + '" target="_blank" rel="noopener noreferrer">Researchers</a>.'
            : language === 'cebuano'
                ? 'Pwede ka mag-explore sa mga people pages dinhi: <a href="' + getRelativePath(maybeLinks.researchers) + '" target="_blank" rel="noopener noreferrer">Researchers</a>.'
                : 'You can explore the people pages here: <a href="' + getRelativePath(maybeLinks.researchers) + '" target="_blank" rel="noopener noreferrer">Researchers</a>.';

        if (containsAny(text, ['researcher', 'researchers', 'faculty', 'student', 'researcher', 'mga mananaliksik', 'estudyante']) ) {
            return researchers;
        }

        const communities = language === 'tagalog'
            ? 'Ang community pages ay nagpapakita ng mga komunidad at dokumentasyon. Simulan sa Kagan page: <a href="' + getRelativePath(maybeLinks.communities) + '" target="_blank" rel="noopener noreferrer">Communities</a>.'
            : language === 'cebuano'
                ? 'Ang community pages nagpakita sa mga komunidad ug dokumentasyon. Sugdi sa Kagan page: <a href="' + getRelativePath(maybeLinks.communities) + '" target="_blank" rel="noopener noreferrer">Communities</a>.'
                : 'The community pages highlight language communities and related documentation work. Start with the Kagan page: <a href="' + getRelativePath(maybeLinks.communities) + '" target="_blank" rel="noopener noreferrer">Communities</a>.';

        if (containsAny(text, ['community', 'communities', 'kagan', 'manobo', 'mansaka', 'komunidad', 'komunidad']) ) {
            return communities;
        }

        const thanks = language === 'tagalog'
            ? 'Walang anuman. Nandito ako para tulungan ka sa pag-explore sa site.'
            : language === 'cebuano'
                ? 'Walay sapayan. Ania ko aron matabangan ka sa pag-explore sa site.'
                : 'You are welcome. I am here to help you explore the site.';

        if (containsAny(text, ['thank', 'thanks', 'salamat', 'daghang salamat']) ) {
            return thanks;
        }

        if (language === 'tagalog') {
            return 'Maaari akong tulungan sa overview ng lab, mga proyekto, publikasyon, researchers, communities, at contact information. Subukan ang “Ano ang lab?” o “Ipakita ang mga proyekto.”';
        }
        if (language === 'cebuano') {
            return 'Makatabang ko sa overview sa lab, mga proyekto, publikasyon, researchers, communities, ug contact information. Sulayi ang “Unsa ang lab?” o “Ipakita ang mga proyekto.”';
        }

        return 'I can help with the lab overview, projects, publications, researchers, communities, and contact information. Try asking: “What does the lab do?” or “Show me projects.”';
    }

    function renderSuggestions() {
        suggestions.innerHTML = '';
        quickSuggestions.forEach(item => {
            const button = document.createElement('button');
            button.className = 'minna-chatbot-suggestion';
            button.type = 'button';
            button.textContent = item;
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                input.value = item;
                openPanel();
                button.remove();
                form.requestSubmit();
            });
            suggestions.appendChild(button);
        });
    }

    function openPanel() {
        panel.classList.add('is-open');
        input.focus();
    }

    function closePanel() {
        panel.classList.remove('is-open');
    }

    function init() {
        renderSuggestions();
        addMessage('Hi! I can help you browse the MinNa LProc site. Try one of the suggestions below.', 'bot');

        toggleButton.addEventListener('click', () => {
            panel.classList.contains('is-open') ? closePanel() : openPanel();
        });

        closeButton.addEventListener('click', closePanel);

        panel.addEventListener('click', event => {
            event.stopPropagation();
        });

        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            openPanel();

            const userInput = input.value.trim();
            if (!userInput) {
                return;
            }

            addMessage(escapeHtml(userInput), 'user');
            input.value = '';
            const response = createReply(userInput);
            window.setTimeout(() => {
                addMessage(response, 'bot');
            }, 240);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closePanel();
            }
        });
    }

    init();
})();
