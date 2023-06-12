引入typescript就是为了有类型组织代码和静态检查开发起来会更舒适的，结果发现默认情况下ts对于chrome extension的api识别不了，需要引入另外的类型库：

https://www.npmjs.com/package/@types/chrome

$ yarn add @types/chrome -D

会在目录 node_modules/@types/chrome 下创建声明文件

然后打开tsconfig.json文件，检查编译选项（compilerOptions）的types，添加chrome类型

"compilerOptions": {
	...

	"types": [
		...
			
		"chrome"
	],
}