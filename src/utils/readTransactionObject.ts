export function readTransactionObject(transaction: any): {
  status: string;
  error: string;
  txhash: string;
} {
  if(transaction?.effects?.status){
    const { status, error } = transaction.effects?.status;
    return {
      status, 
      error,
      txhash: transaction.certificate.transactionDigest
    }
  }

  return {
    status: transaction?.effects?.effects?.status?.status, 
    error: '',
    txhash: transaction.certificate.transactionDigest
  }
}
