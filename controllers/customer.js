const { getAllCustomers, getCustomerById, addCustomer, updateCustomer, removeCustomer } = require('../dao/customerDAO');
const { Customer } = require('../model/Customer')

const getCustomer = async (req, res) => {
    try {
        console.log('req.user_role: ', req.user_role)
        const customres = await getAllCustomers();
        return res.json(customres)
    } catch (error) {
        return res.json({ error: 'something went wrong' }).status(500)
    }
}

const getCustomerByIdController = async (req, res) => {
    const id = req.params?.id;
    try {
        const customres = await getCustomerById(id);
        if (customres.length > 0) {
            return res.json(customres[0])
        }
        return res.json({ message: `there is no customer with id ${id}` })
    } catch (error) {
        return res.json({ error: 'something went wrong' }).status(500)
    }
}

const postCustomer = async (req, res) => {
    const { firstName, lastName, address, phoneNo, creditCardNo, userName, password } = req.body;
    const customerObject = new Customer(firstName, lastName, address, phoneNo, creditCardNo, userName, password);

    if (req.body) {
        try {
            const id = await addCustomer(customerObject);
            return res.json(id)
        } catch (error) {
            return res.json({ error })
        }
    } else {
        return res.json({ message: "No body was provided" }).status(400);
    }
}

const deleteCustomer = async (req, res) => {
    const id = req.params?.id;
    try {
        const data = await removeCustomer(id);
        return res.json(data)
    } catch (error) {
        return res.json({ error: 'something went wrong' }).status(500)
    }
}

const patchCustomerController = async (req, res) => {
    async (req, res) => {
        const id = req.params?.id;
        const { firstName, lastName, address, phoneNo, creditCardNo, userName, password } = req.body;
        const customerObject = new Customer(firstName, lastName, address, phoneNo, creditCardNo, userName, password);
        if (id && req.body) {
            const data = await getCustomerById(id);
            if (data.length > 0) {
                const customer = data[0]; //current customer in database
                for (const key in customerObject) {
                    const value = customerObject[key];
                    if (value) {
                        customer[key] = value;
                    }
                }
                try {
                    await updateCustomer(customer, id);
                    return res.json(customer.Id)
                } catch (error) {
                    return res.json({ message: 'something went wrong', error }).status(500)
                }
            } else {
                return res.json({ message: 'there is no user with database' })
            }
        } else {
            return res.json({ message: 'body or id is missing' }).status(400)
        }

    }
}

const putCustomerController = async (req, res) => {

}

module.exports = {
    getCustomer,
    postCustomer,
    deleteCustomer,
    patchCustomerController,
    getCustomerByIdController,
    putCustomerController
}