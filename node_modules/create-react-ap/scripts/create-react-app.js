const fs = require('fs')
const path = require('path')

const displayTitle = () => {
  console.log('                  React Boilerplate    ')
  console.log('                                       ')
  console.log('                        /\\            ')
  console.log('                       /  \\           ')
  console.log('                      /    \\          ')
  console.log('                     /      \\         ')
  console.log('                    /        \\        ')
  console.log('                   /          \\       ')
  console.log('                  /   < () >   \\      ')
  console.log('                 /    < () >    \\     ')
  console.log('                /     < () >     \\    ')
  console.log('               /                  \\   ')
  console.log('              /        }--{        \\  ')
  console.log('             /______________________\\ ')
  console.log('                                       ')
  console.log('                                       ')
}

const color = {
  main: () => {
    console.log('\x1b[32m') // Change terminal color while running script
  },
  error: () => {
    console.log('\x1b[31m') // Red
  },
  reset: () => {
    console.log('\x1b[0m') // resets color back to terminal color
  }
}

// Recursive folder copier
const recursiveCopy = (source, destination) => {
  // If is file, copy as is
  if (fs.lstatSync(source).isFile()) {
    fs.copyFileSync(source, destination)
  // If is folder, recursive copy
  } else {
    // Make destination folder
    fs.mkdirSync(destination)
    // iterate over elements in source folder
    fs.readdirSync(source).forEach(element => {
      // recursive copy each item and let it decide if it is a folder or not
      recursiveCopy(path.join(source, element), path.join(destination, element))
    })
  }
}

// Child Process Command Runner
const exec = require('child_process').exec
const run = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error)
      resolve(stdout || stderr)
    })
  })
}

const hyphenate = (string) => string
  .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
  .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`)

const cammelCase = (string) => string.replace(/-([a-z])/g, letter => letter[1].toUpperCase())

const createReactApp = async () => {
  try {
    // Set main color
    color.main()

    displayTitle()

    // get project name argument
    let { 2: projectName } = process.argv
    // ensure hyphenation
    projectName = hyphenate(projectName)
    // os safe project path
    const projectDir = path.join(projectName)
    // Make new folder
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir)
    } else {
      // Exit early
      color.error()
      console.log('Project directory already exists')
      color.reset()
      process.exit()
    }

    console.log('Creating New Project')

    const sourceDir = path.join(__dirname, '..')
    const sourceFiles = fs.readdirSync(sourceDir)

    const exclude = [
      'node_modules',
      'scripts',
      '.git',
      'dist'
    ]
    sourceFiles.forEach((element) => {
      // ignore exluded directories an files
      if (!exclude.includes(element)) {
        const sourceElementPath = path.join(sourceDir, element)
        const destinationElementPath = path.join(projectDir, element)
        // Make new package.json
        if (element === 'package.json') {
          // Set project name as package name
          const packageData = JSON.parse(fs.readFileSync(sourceElementPath))
          packageData.name = projectName
          delete packageData.main
          delete packageData.scripts['create-react-app']
          packageData.private = true
          packageData.version = '0.0.0'
          fs.writeFileSync(destinationElementPath, JSON.stringify(packageData, null, 2), 'utf8')
        } else if (element === 'webpack.config.js') {
          // Set project name as title
          let webpackConfig = fs.readFileSync(sourceElementPath, 'utf8')
          webpackConfig = webpackConfig.replace(/React Boilerplate/g, cammelCase(projectName))
          fs.writeFileSync(destinationElementPath, webpackConfig, 'utf8')
        } else {
          recursiveCopy(sourceElementPath, destinationElementPath)
        }
      }
    })

    // Change into project directory
    process.chdir(path.resolve(projectDir))

    // Initialize a new git repo
    await run('git init')
    // Add files
    await run('git add .')
    // Commit files
    await run('git commit -m "Created React App from React Boilerplate"')
    console.log('Done')
  } catch (error) {
    color.error()
    console.log(error)
  }
  color.reset()
}

createReactApp()
