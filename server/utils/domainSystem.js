class DomainSystem {
    constructor() {
        this.domains = new Map();
        this.tld = 'spheredev';
    }

    registerDomain(domainName, projectId) {
        const fullDomain = domainName.endsWith(this.tld) ? 
            domainName : `${domainName}.${this.tld}`;
        
        if (this.domains.has(fullDomain)) {
            throw new Error('Доменное имя уже занято');
        }

        this.domains.set(fullDomain, {
            projectId,
            registeredAt: new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        });

        return fullDomain;
    }

    resolveDomain(domainName) {
        return this.domains.get(domainName);
    }

    getAvailableDomains() {
        return Array.from(this.domains.entries());
    }
}

// Экспорт через export, а не export default
export default new DomainSystem();