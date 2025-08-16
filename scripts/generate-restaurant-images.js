const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT, 'database', 'restaurants')
const PUBLIC_DIR = path.join(ROOT, 'apps', 'web', 'public')
const OUT_IMG_DIR = path.join(PUBLIC_DIR, 'restaurants')
const OUT_DATA_DIR = path.join(PUBLIC_DIR, 'data')
const OUT_JSON = path.join(OUT_DATA_DIR, 'restaurant-images.json')

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']

function ensureDir(dir) {
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function slugify(str) {
	return str
		.toString()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9а-яё\s\-_.]/gi, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
}

function pickImage(files) {
	// Prefer common names
	const priority = ['image.png', 'image.jpg', 'image.webp']
	for (const p of priority) {
		if (files.includes(p)) return p
	}
	// Else first supported ext
	const candidates = files.filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()))
	return candidates.sort()[0] || null
}

function run() {
	ensureDir(OUT_IMG_DIR)
	ensureDir(OUT_DATA_DIR)

	const entries = fs.readdirSync(SRC_DIR, { withFileTypes: true })
	const mapping = []

	for (const dirent of entries) {
		if (!dirent.isDirectory()) continue
		const folder = dirent.name
		const folderPath = path.join(SRC_DIR, folder)
		const files = fs.readdirSync(folderPath)
		const chosen = pickImage(files)
		if (!chosen) continue

		const srcFile = path.join(folderPath, chosen)
		const ext = path.extname(chosen).toLowerCase()
		const slug = slugify(folder)
		const outFileName = `${slug}${ext}`
		const outPath = path.join(OUT_IMG_DIR, outFileName)
		fs.copyFileSync(srcFile, outPath)

		mapping.push({
			folder,
			slug,
			file: `/restaurants/${outFileName}`
		})
	}

	fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedAt: new Date().toISOString(), items: mapping }, null, 2), 'utf8')
	console.log(`Generated ${mapping.length} images -> ${OUT_IMG_DIR}`)
	console.log(`Mapping written to ${OUT_JSON}`)
}

run() 