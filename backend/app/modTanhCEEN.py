import numpy as np

if __name__ == "__main__":
    print("This code runs only when my_module.py is executed directly.")


def C_Coef(p1, p2, lam, q0):
    result = (np.exp(-lam*(p2-p1)) - np.exp(-lam*(p2+p1-2*q0))  )/(p1-q0)
    result = result + (  np.exp(-lam*(p2+p1-2*q0)) - np.exp(lam*(p2-p1)) )/(p2-q0)
    return result

def D_Coef(p1, p2, lam, q0):
    return C_Coef(p1, p2, -1*lam, q0)

def modTanh(p1, p2, lam, q0, q, C_coef, D_coef):
    if lam == 0:
        return q
    if q == q0:
        return q
        
    result = ( np.exp(lam*(p1-p2)) - np.exp(-lam*(p1-p2)) )*( np.exp(lam*(q-q0)) - np.exp(-lam*(q-q0)) )
    result = result/( C_coef*np.exp(lam*(q-q0)) + D_coef*np.exp(-lam*(q-q0)) )
    result = result + q0
    return result