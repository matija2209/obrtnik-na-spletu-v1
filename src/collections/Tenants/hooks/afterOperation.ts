import type { CollectionAfterOperationHook } from 'payload'


const afterOperationHook: CollectionAfterOperationHook = async ({ result,operation,args,req }) => {
    if (operation === 'create') {

    }
    return result
  }

export default afterOperationHook