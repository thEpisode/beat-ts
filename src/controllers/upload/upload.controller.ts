function uploadController (dependencies: any) {
  const _s3 = dependencies.s3
  const _spacesManager = dependencies.spacesManager
  const _utilities = dependencies.utilities
  const _excel = dependencies.exceljs
  const _controllers = dependencies.controllers

  const listBuckets = async () => {
    return _s3.listBuckets().promise()
  }

  const createBucket = async (bucketParams: any) => {
    return _s3.createBucket(bucketParams).promise()
  }

  const uploadObject = async (uploadParams: any) => {
    return _s3.upload(uploadParams).promise()
  }

  const existsBucket = (buckets: any, bucketName: any) => {
    let existBucket = false
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]
      if (bucket.Name === bucketName) {
        existBucket = true
        break
      }
    }

    return existBucket
  }

  const uploadFile = async (req: any) => {
    try {
      if (!req || !req.file) {
        return _utilities.response.error('Add a file')
      }

      if (!req.body || !req.body.route || !req.body.handler) {
        return _utilities.response.error('Add a path to handle your bulk request, please')
      }

      if (!_controllers[req.body.route] || !_controllers[req.body.route][req.body.handler]) {
        return _utilities.response.error('Given path to handle your bulk request is not available')
      }

      const file = req.file
      file.originalname = `${file.originalname.slice(0, file.originalname.lastIndexOf('.'))}_${Date.now()}${file.originalname.slice(file.originalname.lastIndexOf('.'), file.originalname.length)}`
      const bucketName = _spacesManager.getCredentials().bucket
      const uploadParams = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ACL: 'public-read'
      }
      const bucketsResponse = await listBuckets()

      if (!existsBucket(bucketsResponse.Buckets, bucketName)) {
        const bucketParams = {
          Bucket: bucketName,
          ACL: 'public-read'
        }

        await createBucket(bucketParams)
      }

      const uploadResponse = await uploadObject(uploadParams)

      if (!uploadResponse) {
        return _utilities.response.error('Something was wrong uploading the file')
      }

      const payload = dependencies.isJsonString(req.body.payload || '') ? JSON.parse(req.body.payload) : {}
      const entityResponse = await _controllers[req.body.route][req.body.handler]({
        ...payload,
        ...{
          filename: uploadResponse.key,
          uri: uploadResponse.Location
        }
      })

      return entityResponse
    } catch (error) {
      return _utilities.response.error(error.message ? error.message : error)
    }
  }

  const bulkFileHandler = async (file: any) => {
    const transformFileData = async (resolve: any) => {
      const workbook = new _excel.Workbook()
      const processedFile: any = { rows: [] }

      await workbook.xlsx.load(file.buffer)

      workbook.eachSheet((worksheet: any, sheetId: any) => {
        if (worksheet._rows <= 0) {
          resolve(processedFile)
          return
        }

        const labels = worksheet._rows[0].values

        worksheet.eachRow({}, (row: any, rowNumber: any) => {
          if (rowNumber > 1) {
            // Transform rows to objects
            const transformedRow: any = Object
              .assign({}, ...row.values
                .map((item: any, index: any) => ({
                  [labels[index].toLocaleLowerCase()]: (item && item.result ? item.result : item && item.text ? item.text : item)
                })
                )
              )

            processedFile.rows.push(transformedRow)
            resolve(processedFile)
          }
        })
      })
    }

    return new Promise(transformFileData)
  }

  const bulk = async (req: any) => {
    try {
      if (!req || !req.file) {
        return _utilities.response.error('Add a file')
      }

      if (!req.body || !req.body.route || !req.body.handler) {
        return _utilities.response.error('Add a path to handle your bulk request, please')
      }

      if (!_controllers[req.body.route] || !_controllers[req.body.route][req.body.handler]) {
        return _utilities.response.error('Given path to handle your bulk request is not available')
      }

      const file: any = req.file
      const fileTransformed: any = await bulkFileHandler(file)

      if (!fileTransformed || !fileTransformed.rows || !fileTransformed.rows.length) {
        return _utilities.response.error('File not processed because is empty')
      }

      const response = {
        success: 0,
        failed: 0
      }

      await Promise.all(fileTransformed.rows.map((row: any) => {
        const bulkHandler = async (resolve: any) => {
          const entityResponse = await _controllers[req.body.route][req.body.handler](row)

          if (entityResponse && entityResponse.success) {
            response.success += 1
          } else {
            response.failed += 1
          }

          resolve()
        }

        return new Promise(bulkHandler)
      }))

      return _utilities.response.success(response)
    } catch (error) {
      return _utilities.response.error(error.message)
    }
  }

  return {
    uploadFile,
    bulk
  }
}

module.exports = uploadController
