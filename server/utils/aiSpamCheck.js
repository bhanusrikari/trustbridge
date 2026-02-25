/**
 * Mock AI Spam Detection Utility
 * Scans text or document content for potential spam, fraud, or invalid input.
 */
const aiSpamCheck = async (content) => {
    // In a real implementation, this would call an external API like OpenAI, Gemini, or a custom NLP model.
    console.log(`[AI-Spam-Check] Scanning content: "${content.substring(0, 50)}..."`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const spamKeywords = [
        'spam', 'fraud', 'fake', 'test123', 'admin', 'password', 'hack',
        'win money', 'click here', 'guaranteed profit', 'crypto', 'lottery',
        'inheritance', 'viagra', 'casino', 'betting', 'earn fast'
    ];
    const containsSpam = spamKeywords.some(keyword => content.toLowerCase().includes(keyword));

    // Mock Document Analysis
    const docKeywords = ['http', 'https', '.pdf', '.jpg', '.png', 'drive.google', 'dropbox'];
    const likelyHasDocument = docKeywords.some(keyword => content.toLowerCase().includes(keyword));

    if (containsSpam) {
        return {
            isSpam: true,
            confidence: 0.98,
            reason: "Content contains flagged restricted keywords or suspicious patterns.",
            analysis: null
        };
    }

    return {
        isSpam: false,
        confidence: 0.99,
        reason: "Content appears legitimate and safe.",
        docAnalysis: likelyHasDocument ? {
            status: 'Verified',
            summary: 'Document appears to be a valid identification or certificate link.',
            aiConfidence: 0.95
        } : null
    };
};

module.exports = aiSpamCheck;
