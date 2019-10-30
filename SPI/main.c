#include <stm32f10x_conf.h>
#include "SPI.h"
#include "stm32f10x.h"

#define SH

#ifdef OS_USE_SEMIHOSTING
  extern void initialise_monitor_handles(void);
#endif

uint8_t aRxBuffer [10];
uint8_t ubRxIndex = 0;
uint8_t ubTxIndex = 0;

static void SysTickConfig(void) {
  /* Setup SysTick Timer for 10ms interrupts  */
  if (SysTick_Config(SystemCoreClock / 100))
  {
    /* Capture error */
    while (1);
  }
  /* Configure the SysTick handler priority */
  NVIC_SetPriority(SysTick_IRQn, 0x0);
}

uint8_t NRF_Read_Reg(uint8_t reg) {
    uint8_t reg_val;
    SPI_CSN_L();
    SPI_RW(reg);
    reg_val = SPI_RW(0);
    SPI_CSN_H();

    return 	reg_val;
}

uint8_t NRF_Read_Buf(uint8_t reg, uint8_t *pBuf, uint8_t uchars) {
    uint8_t i;
    uint8_t status;
    SPI_CSN_L();
    status = SPI_RW(reg);
    for(i=0; i<uchars; i++)
    {
        pBuf[i] = SPI_RW(0);
    }
    SPI_CSN_H();
    return 	status;
}

void SPI1_IRQHandler(void) {
  /* SPI in Slave Tramitter mode--------------------------------------- */
  if (SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_TXE) == SET) {
    SPI_RW(TxBuffer[ubTxIndex++]);
    if (ubTxIndex == 5)
    {
      /* Disable the Tx buffer empty interrupt */
      SPI_I2S_ITConfig(SPI1, SPI_I2S_IT_TXE, DISABLE);
    }
  }

  /* SPI in Slave Receiver mode--------------------------------------- */
  if (SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_RXNE) == SET) {
    NRF_Read_Buf(0x00, aRxBuffer, 5);
    #ifdef OS_USE_SEMIHOSTING
      printf("%02x\r\n", aRxBuffer);
    #endif
  }

  /* SPI Error interrupt--------------------------------------- */
  if (SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_OVR) == SET) {
    uint8_t error = NRF_Read_Reg(0x00);
    SPI_I2S_GetITStatus(SPI1, SPI_I2S_IT_OVR);
  }
}

int main(void) {

  #ifdef OS_USE_SEMIHOSTING
    initialise_monitor_handles();
  #endif

  /* SPI configuration ------------------------------------------------------*/
  SPI_Config();

  /* SysTick configuration ---------------------------------------------------*/
  SysTickConfig();

  /* Configure the SysTick handler priority */
  NVIC_SetPriority(SysTick_IRQn, 0x0);

  SPI1_INIT();
  for(;;) {}
}
