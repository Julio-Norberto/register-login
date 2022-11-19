const chalk = require('chalk')
const inquirer = require('inquirer')

const fs = require('fs')

console.log(chalk.green('Bem vindo ao nosso sistema!\n'))

operation()

// this function is responsable for shows the actions list for the user and collect the user's response.
function operation() {

	inquirer.prompt([
	   {
	      type: 'list',
	      name: 'actions',
	      message: 'Escolha uma opção: ',
	      choices: [
	      	'Criar conta',
		'Fazer login',
		'Sair'
	      ],
	   },
	]).then((answer) => {
	   const action = answer['actions']

	   if(action === 'Criar conta') {
		createAccount()
		return
	   } else if(action === 'Fazer login') {
		loginValidation()
		return
	   } else {
		console.log(chalk.magenta('Obrigado por utilizar o nosso sistema!'))
		return
	   }
	})
}

function createAccount() {
	console.log(chalk.bgBlue.white.bold('Muito obrigado por escolher o nosso sistema!'))
	console.log(chalk.green('Vamos começar a criar a sua conta'))

	validation()
}

// this function is responsable for the creation of the json file with the information of the users
function register(loginName) {
	inquirer.prompt([
		{
			name: 'email',
			message: 'Informe seu e-mail: '
		},
		{
			name: 'password',
			message: 'Informe sua senha: '
		},
	]).then((answer) => {
		const email = answer['email']
		const password = answer['password']

		fs.writeFileSync(
			`users/${loginName}.json`,
			`{ "email": "${email}", "password":${password} }`,
			function(error) {
				console.log(error)
			},
		)

		console.log(chalk.green.bold(`Parabéns, ${loginName}! Sua conta foi criada com sucesso!`))
	})
}

// this function validate if the login of users already exists
function validation() {
	inquirer.prompt([
		{
			name: 'loginName',
			message: 'Crie o seu login: '
		},
	]).then((answer) => {
		const loginName = answer['loginName']

		if(!fs.existsSync('users')) {
			fs.mkdirSync('users')
		}

		if(fs.existsSync(`users/${loginName}.json`)) {
			console.log(chalk.red.bold('Essa conta já existe!'))
			validation()
			return
		}

		register(loginName)
	})
}

function loginValidation() {
	inquirer.prompt([
		{
			name: 'loginName',
			message: 'Informe o seu login: '
		},
	]).then((answer) => {
		const loginName = answer['loginName']

		if(!fs.existsSync(`users/${loginName}.json`)) {
			console.log(chalk.red('Usuário não cadastrado!'))
			validation()
			return
		}

		login(loginName)
	})
}

function login(loginName) {
	inquirer.prompt([
		{
			name: 'password',
			message: 'Informe a sua senha: '
		},
	]).then((answer) => {
		const password = answer['password']

		fs.readFile(`users/${loginName}.json`, 'utf8', (err, data) => {
			if(err) {
				console.log(chalk.red(err))
			}

			const dataPass = JSON.parse(data)
			const userPassword = dataPass.password

			if(password.toString() !== userPassword.toString()) {
				console.log(chalk.red('Senha incorreta. tente novamente'))
				login(loginName)
				return
			}

			console.log(chalk.green.bold(`Seja bem vindo, ${loginName}!`))
		})

	})
}