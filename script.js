class IdeaToPRD {
    constructor() {
        this.currentPRD = null;
        this.settings = {
            geminiApiKey: 'AIzaSyDH3t25pYyd2FIOMrLGiCK5xzl2oihI6ZU',
            generationMode: 'balanced'
        };
        this.blockCounter = 0;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.setupAutoSave();
    }

    loadSettings() {
        const saved = localStorage.getItem('ideaToPrdSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.updateSettingsUI();
        }
    }

    saveSettings() {
        localStorage.setItem('ideaToPrdSettings', JSON.stringify(this.settings));
    }

    updateSettingsUI() {
        const modeSelect = document.getElementById('generationMode');
        
        if (modeSelect && this.settings.generationMode) {
            modeSelect.value = this.settings.generationMode;
        }
    }

    bindEvents() {
        // Navigation
        document.getElementById('newPrdBtn').addEventListener('click', this.showIdeaInput.bind(this));
        document.getElementById('exportBtn').addEventListener('click', this.showExportModal.bind(this));
        document.getElementById('settingsBtn').addEventListener('click', this.showSettingsModal.bind(this));
        document.getElementById('backToIdeaBtn').addEventListener('click', this.showIdeaInput.bind(this));

        // Idea Input
        document.getElementById('generateBtn').addEventListener('click', this.generatePRD.bind(this));
        
        // Example cards
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', this.handleExampleClick.bind(this));
        });

        // Settings Modal
        document.getElementById('closeSettingsBtn').addEventListener('click', this.hideSettingsModal.bind(this));
        document.getElementById('cancelSettingsBtn').addEventListener('click', this.hideSettingsModal.bind(this));
        document.getElementById('saveSettingsBtn').addEventListener('click', this.handleSaveSettings.bind(this));

        // Export Modal
        document.getElementById('closeExportBtn').addEventListener('click', this.hideExportModal.bind(this));
        document.getElementById('exportMarkdown').addEventListener('click', () => this.exportPRD('markdown'));
        document.getElementById('exportPdf').addEventListener('click', () => this.exportPRD('pdf'));
        document.getElementById('exportJson').addEventListener('click', () => this.exportPRD('json'));
        document.getElementById('copyToClipboard').addEventListener('click', () => this.exportPRD('clipboard'));

        // Add Block Modal
        document.getElementById('addBlockBtn').addEventListener('click', this.showAddBlockModal.bind(this));
        document.getElementById('closeAddBlockBtn').addEventListener('click', this.hideAddBlockModal.bind(this));
        
        document.querySelectorAll('.block-type').forEach(btn => {
            btn.addEventListener('click', this.handleAddBlock.bind(this));
        });



        // Modal Overlay Clicks
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                }
            });
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    setupAutoSave() {
        // Auto-save PRD content every 2 seconds
        setInterval(() => {
            if (this.currentPRD) {
                this.savePRDToStorage();
            }
        }, 2000);
    }

    handleExampleClick(e) {
        const example = e.currentTarget.getAttribute('data-example');
        document.getElementById('ideaInput').value = example;
        
        // Scroll to input
        document.getElementById('ideaInput').focus();
        document.getElementById('ideaInput').scrollIntoView({ behavior: 'smooth' });
    }

    async generatePRD() {
        const ideaInput = document.getElementById('ideaInput');
        const generateBtn = document.getElementById('generateBtn');
        const idea = ideaInput.value.trim();

        if (!idea) {
            this.showToast('Please enter your product idea', 'error');
            return;
        }

        // API key is now integrated directly

        // Show loading state
        this.showLoading(true);
        generateBtn.disabled = true;
        generateBtn.querySelector('.btn-text').classList.add('hidden');
        generateBtn.querySelector('.btn-loading').classList.remove('hidden');

        try {
            const mvpOnly = document.getElementById('mvpOnly').checked;
            const includeWireframes = document.getElementById('includeWireframes').checked;

            const prdData = await this.callGeminiAPI(idea, mvpOnly, includeWireframes);
            this.currentPRD = prdData;
            
            this.renderPRD(prdData);
            this.showPRDEditor();
            this.savePRDToStorage();
            
            this.showToast('PRD generated successfully!', 'success');

        } catch (error) {
            console.error('Error generating PRD:', error);
            this.showToast('Failed to generate PRD. Please check your API key and try again.', 'error');
        } finally {
            this.showLoading(false);
            generateBtn.disabled = false;
            generateBtn.querySelector('.btn-text').classList.remove('hidden');
            generateBtn.querySelector('.btn-loading').classList.add('hidden');
        }
    }

    async callGeminiAPI(idea, mvpOnly, includeWireframes) {
        const prompt = this.buildPrompt(idea, mvpOnly, includeWireframes);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.settings.geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4000,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        
        return this.parsePRDContent(content, idea);
    }

    buildPrompt(idea, mvpOnly, includeWireframes) {
        const scope = mvpOnly ? 'MVP-focused with essential features only' : 'comprehensive with advanced features and detailed planning';
        const wireframes = includeWireframes ? ' Include wireframe suggestions in functional requirements.' : '';
        
        return `You are a Product Manager creating a structured PRD for the product idea: "${idea}"

Create a ${scope} PRD formatted as JSON with these specific sections for a card-based layout:

{
  "title": "[Professional Product Name]",
  "subtitle": "[Clear value proposition in 1-2 sentences]",
  "blocks": [
    {
      "type": "problem",
      "title": "Problem",
      "content": "Define the core problem this product solves. Include specific user pain points and quantify the impact. Keep concise for card display."
    },
    {
      "type": "solution",
      "title": "Goals", 
      "content": "List 3-5 specific, measurable objectives this product aims to achieve. Include both business and user goals with success criteria."
    },
    {
      "type": "metrics",
      "title": "Metrics",
      "content": "Define key performance indicators (KPIs) and success metrics. Include target numbers and measurement methods."
    },
    {
      "type": "features",
      "title": "Functional Requirements",
      "content": "List core features and capabilities the system must provide. Include user workflows and key interactions. Organize by priority.${wireframes}"
    },
    {
      "type": "technical", 
      "title": "Non-functional Requirements",
      "content": "Define performance, security, usability, and quality requirements. Include scalability needs and technical constraints."
    },
    {
      "type": "risks",
      "title": "Risks",
      "content": "Identify key risks (technical, market, operational) with probability and impact. Include mitigation strategies for each risk."
    },
    {
      "type": "users",
      "title": "Stakeholders", 
      "content": "List key stakeholders, their roles, and interests in the project. Include decision makers and influencers."
    },
    {
      "type": "timeline",
      "title": "Dependencies",
      "content": "Identify external dependencies, prerequisite requirements, and constraints that could impact development."
    }
  ]
}

Keep each section concise and focused for card display. Use bullet points and short paragraphs. Include specific, actionable details.

Return only valid JSON without markdown formatting or code blocks.`;
    }

    parsePRDContent(content, originalIdea) {
        try {
            // Clean the content to ensure it's valid JSON
            const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanContent);
            
            return {
                ...parsed,
                originalIdea,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Error parsing PRD content:', error);
            
            // Fallback: create a basic structure
            return {
                title: 'Product Requirements Document',
                subtitle: 'Generated from your idea',
                originalIdea,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                blocks: [
                    {
                        type: 'problem',
                        title: 'Problem Statement',
                        content: 'Please edit this section with your problem definition.'
                    },
                    {
                        type: 'solution',
                        title: 'Solution Overview',
                        content: content || 'Please edit this section with your solution overview.'
                    }
                ]
            };
        }
    }

    renderPRD(prdData) {
        // Update title and subtitle
        document.getElementById('prdTitle').textContent = prdData.title;
        document.getElementById('prdSubtitle').textContent = prdData.subtitle;

        // Render as card-based layout
        const blocksContainer = document.getElementById('prdBlocks');
        blocksContainer.innerHTML = '';

        // Create card-based content
        this.createCardBasedContent(prdData.blocks, blocksContainer);

        // Store current PRD data for editing
        this.currentPRD = prdData;
    }

    createCardBasedContent(blocks, container) {
        // Define the card layout structure based on reference image
        const cardStructure = [
            {
                gridClass: 'three-column',
                cards: ['problem', 'goals', 'metrics']
            },
            {
                gridClass: 'three-column', 
                cards: ['hypotheses', 'experiments', 'learn-build']
            },
            {
                gridClass: 'two-column',
                cards: ['functional-requirements', 'non-functional-requirements']
            },
            {
                gridClass: 'full-width',
                cards: ['edge-cases']
            },
            {
                gridClass: 'three-column',
                cards: ['dependencies', 'stakeholders', 'risks']
            }
        ];

        // Create default sections with placeholder content
        const defaultSections = {
            'problem': { title: 'Problem', content: 'Define the core problem this product will solve. Include user pain points and market gaps.' },
            'goals': { title: 'Goals', content: 'List specific, measurable objectives this product aims to achieve.' },
            'metrics': { title: 'Metrics', content: 'Define key performance indicators and success metrics.' },
            'hypotheses': { title: 'Hypotheses', content: 'State assumptions about user behavior and market response.' },
            'experiments': { title: 'Experiments', content: 'Plan validation experiments and testing methods.' },
            'learn-build': { title: 'Learn + Build', content: 'Define learning goals and iterative development approach.' },
            'functional-requirements': { title: 'Functional Requirements', content: 'List all functional capabilities and features the system must provide.' },
            'non-functional-requirements': { title: 'Non-functional Requirements', content: 'Define performance, security, usability and quality requirements.' },
            'edge-cases': { title: 'Edge Cases', content: 'Document unusual scenarios and error conditions the system must handle.' },
            'dependencies': { title: 'Dependencies', content: 'List external dependencies and prerequisite requirements.' },
            'stakeholders': { title: 'Stakeholders', content: 'Identify key stakeholders and their roles in the project.' },
            'risks': { title: 'Risks', content: 'Assess potential risks and mitigation strategies.' }
        };

        // Map blocks to sections, filling gaps with defaults
        const sectionData = { ...defaultSections };
        blocks.forEach(block => {
            const sectionKey = this.mapBlockToSection(block.type);
            if (sectionKey && defaultSections[sectionKey]) {
                sectionData[sectionKey] = {
                    title: block.title,
                    content: block.content
                };
            }
        });

        // Create the grid layout
        cardStructure.forEach(row => {
            const gridDiv = document.createElement('div');
            gridDiv.className = `prd-grid ${row.gridClass}`;

            row.cards.forEach(cardKey => {
                const section = sectionData[cardKey];
                if (section) {
                    const card = this.createPRDCard(section.title, section.content, cardKey);
                    gridDiv.appendChild(card);
                }
            });

            container.appendChild(gridDiv);
        });
    }

    mapBlockToSection(blockType) {
        const mapping = {
            'problem': 'problem',
            'solution': 'goals',
            'metrics': 'metrics',
            'features': 'functional-requirements',
            'technical': 'non-functional-requirements',
            'risks': 'risks',
            'users': 'stakeholders',
            'stories': 'functional-requirements',
            'timeline': 'dependencies'
        };
        return mapping[blockType] || null;
    }

    createPRDCard(title, content, cardType) {
        const card = document.createElement('div');
        card.className = `prd-card ${this.getCardSize(cardType)}`;
        card.setAttribute('data-card-type', cardType);

        card.innerHTML = `
            <div class="prd-card-header">
                ${title}
            </div>
            <div class="prd-card-content">
                ${this.formatCardContent(content)}
            </div>
        `;

        return card;
    }

    getCardSize(cardType) {
        const largCards = ['functional-requirements', 'non-functional-requirements'];
        const fullWidthCards = ['edge-cases'];
        
        if (largCards.includes(cardType)) return 'large';
        if (fullWidthCards.includes(cardType)) return 'full-width';
        return '';
    }

    formatCardContent(content) {
        if (!content || content.trim() === '') {
            return '<p><em>Content to be added...</em></p>';
        }
        
        // Clean up content for card display
        if (!content.trim().startsWith('<')) {
            return `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
        }
        
        return content;
    }

    getSectionNumber(type, number) {
        const numberedSections = ['executive', 'problem', 'solution', 'users', 'features', 'stories', 'metrics', 'technical', 'timeline', 'risks'];
        return numberedSections.includes(type) ? `${number}. ` : '';
    }

    getHeadingLevel(type) {
        return type === 'executive' ? '1' : '2';
    }

    isNumberedSection(type) {
        const numberedSections = ['executive', 'problem', 'solution', 'users', 'features', 'stories', 'metrics', 'technical', 'timeline', 'risks'];
        return numberedSections.includes(type);
    }

    formatContent(content) {
        // Ensure content is properly formatted for document display
        if (!content || content.trim() === '') {
            return '<p><em>Content to be added...</em></p>';
        }
        
        // If content doesn't start with a tag, wrap it in paragraphs
        if (!content.trim().startsWith('<')) {
            return `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
        }
        
        return content;
    }

    // Block editing functions removed - document is now read-only display







    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S to save (though auto-save is enabled)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.savePRDToStorage();
            this.showToast('PRD saved', 'success');
        }

        // Ctrl/Cmd + E to export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.showExportModal();
        }

        // Esc to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    }

    showAddBlockModal() {
        document.getElementById('addBlockModal').classList.remove('hidden');
    }

    hideAddBlockModal() {
        document.getElementById('addBlockModal').classList.add('hidden');
    }

    handleAddBlock(e) {
        const blockType = e.target.closest('.block-type').getAttribute('data-type');
        
        const blockTemplates = {
            executive: {
                type: 'executive',
                title: 'Executive Summary',
                content: 'Provide a high-level overview including market opportunity, competitive advantage, business impact, timeline, and resource requirements.'
            },
            problem: {
                type: 'problem',
                title: 'Problem Statement & Market Opportunity',
                content: 'Define the problem with market research backing, user pain points, quantified impact, competitive landscape analysis, and total addressable market (TAM).'
            },
            solution: {
                type: 'solution',
                title: 'Product Solution & Strategy',
                content: 'Describe the strategic solution approach, unique value proposition, competitive differentiation, solution architecture, and go-to-market strategy.'
            },
            users: {
                type: 'users',
                title: 'Target Market & User Personas',
                content: 'Create detailed user personas with demographics, psychographics, pain points, goals, user journey mapping, and market sizing for each segment.'
            },
            features: {
                type: 'features',
                title: 'Product Features & Requirements',
                content: 'List features categorized as MUST-HAVE (P0), SHOULD-HAVE (P1), and NICE-TO-HAVE (P2). Include functional and non-functional requirements with acceptance criteria.'
            },
            stories: {
                type: 'stories',
                title: 'User Stories & Acceptance Criteria',
                content: 'Write detailed user stories in format: "As a [specific user type], I want to [specific action] so that [specific benefit/outcome]." Include acceptance criteria and edge cases.'
            },
            metrics: {
                type: 'metrics',
                title: 'Success Metrics & KPIs',
                content: 'Define quantifiable success metrics including business metrics, product metrics, technical metrics, and user satisfaction metrics with baseline measurements and target goals.'
            },
            technical: {
                type: 'technical',
                title: 'Technical Architecture & Implementation',
                content: 'Recommend specific technology stack, system architecture, database design, API architecture, third-party integrations, security requirements, and scalability considerations.'
            },
            timeline: {
                type: 'timeline',
                title: 'Development Timeline & Milestones',
                content: 'Create a detailed project timeline with development phases, key milestones, dependencies, resource allocation, and delivery dates.'
            },
            risks: {
                type: 'risks',
                title: 'Risk Assessment & Mitigation',
                content: 'Identify technical, market, competitive, resource, and timeline risks. Provide specific mitigation strategies and contingency plans.'
            },
            custom: {
                type: 'custom',
                title: 'Custom Section',
                content: `<h2>Section Overview</h2>
<p>This section provides additional context and details specific to your product requirements.</p>

<h3>Key Points</h3>
<ul>
<li>Define specific requirements or considerations</li>
<li>Include relevant stakeholder information</li>
<li>Document any constraints or dependencies</li>
<li>Add measurable criteria where applicable</li>
</ul>

<h3>Implementation Notes</h3>
<p>Document any specific implementation requirements, technical considerations, or business rules that apply to this area.</p>

<h3>Success Criteria</h3>
<p>Define what success looks like for this particular aspect of the product.</p>`
            }
        };

        const newBlock = blockTemplates[blockType] || blockTemplates.custom;
        
        if (!this.currentPRD) {
            this.currentPRD = {
                title: 'Product Requirements Document',
                subtitle: 'New PRD',
                blocks: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }

        this.currentPRD.blocks.push(newBlock);
        this.renderPRD(this.currentPRD);
        this.updateTimestamp();
        this.hideAddBlockModal();

        // Focus on the new block
        setTimeout(() => {
            const newBlockElement = document.querySelector(`[data-block-id="${this.currentPRD.blocks.length - 1}"] .block-content`);
            if (newBlockElement) {
                newBlockElement.focus();
            }
        }, 100);
    }

    showSettingsModal() {
        document.getElementById('settingsModal').classList.remove('hidden');
    }

    hideSettingsModal() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    handleSaveSettings() {
        const mode = document.getElementById('generationMode').value;

        this.settings.generationMode = mode;
        
        this.saveSettings();
        this.hideSettingsModal();
        this.showToast('Settings saved successfully!', 'success');
    }

    showExportModal() {
        if (!this.currentPRD) {
            this.showToast('No PRD to export. Please generate a PRD first.', 'error');
            return;
        }
        document.getElementById('exportModal').classList.remove('hidden');
    }

    hideExportModal() {
        document.getElementById('exportModal').classList.add('hidden');
    }

    exportPRD(format) {
        if (!this.currentPRD) {
            this.showToast('No PRD to export', 'error');
            return;
        }

        switch (format) {
            case 'markdown':
                this.exportAsMarkdown();
                break;
            case 'pdf':
                this.exportAsPDF();
                break;
            case 'json':
                this.exportAsJSON();
                break;
            case 'clipboard':
                this.copyToClipboard();
                break;
        }

        this.hideExportModal();
    }

    exportAsMarkdown() {
        let markdown = `# ${this.currentPRD.title}\n\n${this.currentPRD.subtitle}\n\n`;
        
        this.currentPRD.blocks.forEach(block => {
            markdown += `## ${block.title}\n\n${this.htmlToMarkdown(block.content)}\n\n`;
        });

        markdown += `\n---\n*Generated on ${new Date().toLocaleDateString()}*`;

        this.downloadFile(`${this.currentPRD.title.replace(/[^a-z0-9]/gi, '_')}.md`, markdown, 'text/markdown');
        this.showToast('PRD exported as Markdown', 'success');
    }

    exportAsPDF() {
        // Create a printable version
        const printWindow = window.open('', '_blank');
        const html = this.generatePrintHTML();
        
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);

        this.showToast('PRD ready for PDF export', 'success');
    }

    exportAsJSON() {
        const json = JSON.stringify(this.currentPRD, null, 2);
        this.downloadFile(`${this.currentPRD.title.replace(/[^a-z0-9]/gi, '_')}.json`, json, 'application/json');
        this.showToast('PRD exported as JSON', 'success');
    }

    async copyToClipboard() {
        const markdown = this.generateMarkdownContent();
        
        try {
            await navigator.clipboard.writeText(markdown);
            this.showToast('PRD copied to clipboard', 'success');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    }

    generateMarkdownContent() {
        let markdown = `# ${this.currentPRD.title}\n\n${this.currentPRD.subtitle}\n\n`;
        
        this.currentPRD.blocks.forEach(block => {
            markdown += `## ${block.title}\n\n${this.htmlToMarkdown(block.content)}\n\n`;
        });

        return markdown;
    }

    htmlToMarkdown(html) {
        // Simple HTML to Markdown conversion
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<p>/gi, '')
            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
            .replace(/<u>(.*?)<\/u>/gi, '$1')
            .replace(/<h1>(.*?)<\/h1>/gi, '# $1')
            .replace(/<h2>(.*?)<\/h2>/gi, '## $1')
            .replace(/<h3>(.*?)<\/h3>/gi, '### $1')
            .replace(/<ul>/gi, '')
            .replace(/<\/ul>/gi, '')
            .replace(/<li>(.*?)<\/li>/gi, '- $1')
            .replace(/<[^>]*>/g, '')
            .trim();
    }

    generatePrintHTML() {
        const blocks = this.currentPRD.blocks.map(block => 
            `<section>
                <h2>${block.title}</h2>
                <div>${block.content}</div>
            </section>`
        ).join('');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${this.currentPRD.title}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
                h1 { font-size: 2.5em; margin-bottom: 0.5em; border-bottom: 2px solid #333; padding-bottom: 0.5em; }
                h2 { font-size: 1.5em; margin: 2em 0 1em 0; color: #2563eb; }
                p { margin-bottom: 1em; }
                section { margin-bottom: 2em; page-break-inside: avoid; }
                .subtitle { font-size: 1.2em; color: #666; margin-bottom: 2em; }
            </style>
        </head>
        <body>
            <h1>${this.currentPRD.title}</h1>
            <div class="subtitle">${this.currentPRD.subtitle}</div>
            ${blocks}
            <footer style="margin-top: 3em; padding-top: 1em; border-top: 1px solid #ccc; color: #666; font-size: 0.9em;">
                Generated on ${new Date().toLocaleDateString()}
            </footer>
        </body>
        </html>`;
    }

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    showIdeaInput() {
        document.getElementById('ideaInputSection').classList.remove('hidden');
        document.getElementById('prdEditorSection').classList.add('hidden');
    }

    showPRDEditor() {
        document.getElementById('ideaInputSection').classList.add('hidden');
        document.getElementById('prdEditorSection').classList.remove('hidden');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    savePRDToStorage() {
        if (this.currentPRD) {
            localStorage.setItem('currentPRD', JSON.stringify(this.currentPRD));
        }
    }

    loadPRDFromStorage() {
        const saved = localStorage.getItem('currentPRD');
        if (saved) {
            try {
                this.currentPRD = JSON.parse(saved);
                this.renderPRD(this.currentPRD);
                this.showPRDEditor();
                return true;
            } catch (error) {
                console.error('Error loading PRD from storage:', error);
                localStorage.removeItem('currentPRD');
            }
        }
        return false;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new IdeaToPRD();
    
    // Try to load any existing PRD
    const hasExistingPRD = app.loadPRDFromStorage();
    
    // If no existing PRD, show the idea input
    if (!hasExistingPRD) {
        app.showIdeaInput();
    }
});

// Export for potential external use
window.IdeaToPRD = IdeaToPRD; 