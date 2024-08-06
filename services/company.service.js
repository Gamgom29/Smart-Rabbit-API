const Company = require('../Models/company.model');

class companyservice{
    constructor(){
        this.company = null;
    }

    async initialize(){
        const companies = await Company.find();
        if(companies.length > 1){
            throw new Error('Multiple companies found');
        }
        if(companies.length == 1) this.company = companies[0];
        else {
            const newCompany = new Company({
                shippingPrice:0,
                treasury:0
            });
            this.company = await newCompany.save();
        }
    }

    getInstance(){
        if(!this.company) throw new Error('No company Found')
        return this.company;
    }
    async updateCompany(data){
        if(!this.company) throw new Error('No company Found')
        Object.assign(this.company , data);
        await this.company.save();
    }
}

const companyService = new companyservice();

module.exports = companyService;