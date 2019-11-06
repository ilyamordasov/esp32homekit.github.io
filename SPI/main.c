#include "stm32f10x.h"
#include "stm32f10x_gpio.h"
#include "stm32f10x_rcc.h"
#include "stm32f10x_spi.h"
#include "SPI.h"

uint8_t RxBuff[128];
uint8_t idx = 0;

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

int main(void) {
  initialise_monitor_handles();

  /* SysTick configuration ---------------------------------------------------*/
  //SysTickConfig();

  printf("Start\r\n");

  SPI1_INIT();

  while(1) {
	  //SPI1_IRQHandler();
  }
}

void print_buf(uint8_t length) {
	char temp[length];
	for (u8 i=0; i<length; i++) {
		printf("0x%02x ", RxBuff[i]);
		temp[i] = (char)RxBuff[i];
	}
	printf("\r\n");
	printf("This is element 0: %s\n", temp);
	idx = 0;
}

void SPI1_IRQHandler(void) {

	for (u8 i=0; i<6; i++) {
		RxBuff[idx] = SPI_RW(0xDD);
		idx++;
	}

	print_buf(6);
	idx = 0;
	memset(RxBuff, 0, 4);
}
